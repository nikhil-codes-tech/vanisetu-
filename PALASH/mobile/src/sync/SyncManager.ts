/**
 * PALASH Sync Manager
 * Central coordinator for online <-> offline synchronization.
 * Handles duplicate prevention, auto-triggers, retries, and offline-first data flow.
 */

import { ApiClient, defaultApiClient } from '../services/api';
import { ConnectivityService, defaultConnectivity } from './connectivity';
import { SyncQueueManager, defaultSyncQueue } from './syncQueue';
import { UploadSynchronizer, UploadSyncResult } from './uploadSync';
import { DownloadSynchronizer, DownloadSyncStats } from './downloadSync';

export interface SyncOptions {
  force?: boolean;
  skipUpload?: boolean;
  skipDownload?: boolean;
}

export interface SyncResult {
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR' | 'OFFLINE' | 'ALREADY_SYNCING';
  uploadResult?: UploadSyncResult;
  downloadStats?: DownloadSyncStats;
  error?: string;
}

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'IDLE' | 'SUCCESS' | 'ERROR' | 'PARTIAL';
  isOnline: boolean;
  pendingUploadCount: number;
  lastError: string | null;
}

export type SyncStateListener = (state: SyncState) => void;

export class SyncManager {
  private api: ApiClient;
  private connectivity: ConnectivityService;
  private queue: SyncQueueManager;
  private uploader: UploadSynchronizer;
  private downloader: DownloadSynchronizer;

  private isSyncing: boolean = false;
  private activeSyncPromise: Promise<SyncResult> | null = null;
  private lastSyncTime: string | null = null;
  private lastSyncStatus: 'IDLE' | 'SUCCESS' | 'ERROR' | 'PARTIAL' = 'IDLE';
  private lastError: string | null = null;

  private stateListeners: Set<SyncStateListener> = new Set();
  private unsubscribeConnectivity: (() => void) | null = null;

  constructor(
    api: ApiClient = defaultApiClient,
    connectivity: ConnectivityService = defaultConnectivity,
    queue: SyncQueueManager = defaultSyncQueue
  ) {
    this.api = api;
    this.connectivity = connectivity;
    this.queue = queue;
    this.uploader = new UploadSynchronizer(this.api, this.queue);
    this.downloader = new DownloadSynchronizer(this.api);
  }

  /**
   * Initializes automatic event listeners:
   * 1. Resets any crashed in-flight queue items
   * 2. Triggers sync when connectivity transitions from offline -> online
   */
  async init(autoSyncOnConnect: boolean = true): Promise<void> {
    await this.queue.resetInProgress();
    this.lastSyncTime = await this.queue.getLastSyncTime('GLOBAL');

    if (autoSyncOnConnect) {
      this.unsubscribeConnectivity = this.connectivity.subscribe((isOnline) => {
        if (isOnline && !this.isSyncing) {
          // Trigger background sync when online status restored
          this.sync().catch(() => {
            // Ignore background sync errors
          });
        }
        this.notifyState();
      });
    }
  }

  /**
   * Cleans up event listeners.
   */
  destroy(): void {
    if (this.unsubscribeConnectivity) {
      this.unsubscribeConnectivity();
      this.unsubscribeConnectivity = null;
    }
    this.stateListeners.clear();
  }

  /**
   * Returns current synchronization state.
   */
  async getSyncState(): Promise<SyncState> {
    const queueStatus = await this.queue.getQueueStatus();
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastSyncStatus: this.lastSyncStatus,
      isOnline: this.connectivity.isOnline(),
      pendingUploadCount: queueStatus.pending + queueStatus.failed,
      lastError: this.lastError,
    };
  }

  /**
   * Subscribes to sync state changes.
   */
  onSyncStateChange(listener: SyncStateListener): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private async notifyState(): Promise<void> {
    const state = await this.getSyncState();
    for (const listener of this.stateListeners) {
      try {
        listener(state);
      } catch {
        // Ignore listener exceptions
      }
    }
  }

  /**
   * Performs full synchronization (Upload pending changes -> Download latest server state).
   * Guarded with duplicate prevention to ensure only one sync executes at a time.
   */
  async sync(options: SyncOptions = {}): Promise<SyncResult> {
    // 1. Duplicate-sync protection: return existing in-flight sync or ALREADY_SYNCING
    if (this.isSyncing) {
      if (this.activeSyncPromise) {
        return this.activeSyncPromise;
      }
      return { status: 'ALREADY_SYNCING' };
    }

    // 2. Check offline status
    if (!this.connectivity.isOnline() && !options.force) {
      return { status: 'OFFLINE' };
    }

    this.isSyncing = true;
    this.lastError = null;
    this.notifyState();

    this.activeSyncPromise = this.executeSync(options);

    try {
      const result = await this.activeSyncPromise;
      return result;
    } finally {
      this.isSyncing = false;
      this.activeSyncPromise = null;
      this.notifyState();
    }
  }

  private async executeSync(options: SyncOptions): Promise<SyncResult> {
    let uploadResult: UploadSyncResult | undefined;
    let downloadStats: DownloadSyncStats | undefined;
    let hasUploadFailure = false;
    let hasDownloadFailure = false;

    // A. UPSTREAM SYNC: Flush pending local mutations to server
    if (!options.skipUpload) {
      try {
        uploadResult = await this.uploader.flushQueue();
        if (uploadResult.failed > 0) {
          hasUploadFailure = true;
          this.lastError = `Upload completed with ${uploadResult.failed} failed items.`;
        }
      } catch (err) {
        hasUploadFailure = true;
        this.lastError = `Upload error: ${(err as Error).message}`;
      }
    }

    // B. DOWNSTREAM SYNC: Fetch server state and persist in foreign-key order
    if (!options.skipDownload) {
      try {
        // Sync teacher & school first
        await this.downloader.syncTeacherProfile().catch(() => {
          // Non-blocking if unauthenticated in guest mode
        });

        // Sync curriculum hierarchy
        downloadStats = await this.downloader.syncCurriculumHierarchy();
      } catch (err) {
        hasDownloadFailure = true;
        this.lastError = `Download error: ${(err as Error).message}`;
      }
    }

    // Determine final status
    if (hasUploadFailure && hasDownloadFailure) {
      this.lastSyncStatus = 'ERROR';
    } else if (hasUploadFailure || hasDownloadFailure) {
      this.lastSyncStatus = 'PARTIAL';
    } else {
      this.lastSyncStatus = 'SUCCESS';
      this.lastSyncTime = new Date().toISOString();
      await this.queue.updateLastSyncTime('GLOBAL', 'SUCCESS');
    }

    return {
      status: this.lastSyncStatus,
      uploadResult,
      downloadStats,
      error: this.lastError || undefined,
    };
  }

  // Convenience accessors
  getQueue(): SyncQueueManager {
    return this.queue;
  }

  getConnectivity(): ConnectivityService {
    return this.connectivity;
  }

  getApi(): ApiClient {
    return this.api;
  }
}

export const defaultSyncManager = new SyncManager();
