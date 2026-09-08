/**
 * PALASH Synchronization & Connectivity State Store
 * Lightweight observable store binding SyncManager and ConnectivityService to React UI.
 */

import React, { useState, useEffect } from 'react';
import { defaultSyncManager, SyncManager, SyncResult } from '../sync/SyncManager';
import { defaultConnectivity, ConnectivityService } from '../sync/connectivity';

export interface SyncStoreState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'IDLE' | 'SUCCESS' | 'ERROR' | 'PARTIAL';
  pendingUploadCount: number;
  lastError: string | null;
}

type Listener = () => void;

class SyncStore {
  private state: SyncStoreState = {
    isOnline: true,
    isSyncing: false,
    lastSyncTime: null,
    lastSyncStatus: 'IDLE',
    pendingUploadCount: 0,
    lastError: null,
  };

  private listeners = new Set<Listener>();
  private syncManager: SyncManager;
  private connectivity: ConnectivityService;
  private initialized = false;

  constructor(
    syncManager: SyncManager = defaultSyncManager,
    connectivity: ConnectivityService = defaultConnectivity
  ) {
    this.syncManager = syncManager;
    this.connectivity = connectivity;
  }

  getState(): SyncStoreState {
    return this.state;
  }

  private setState(partial: Partial<SyncStoreState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // Ignore subscriber error
      }
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    await this.syncManager.init(true);
    const syncState = await this.syncManager.getSyncState();

    this.setState({
      isOnline: this.connectivity.isOnline(),
      isSyncing: syncState.isSyncing,
      lastSyncTime: syncState.lastSyncTime,
      lastSyncStatus: syncState.lastSyncStatus,
      pendingUploadCount: syncState.pendingUploadCount,
      lastError: syncState.lastError,
    });

    this.syncManager.onSyncStateChange((state) => {
      this.setState({
        isOnline: state.isOnline,
        isSyncing: state.isSyncing,
        lastSyncTime: state.lastSyncTime,
        lastSyncStatus: state.lastSyncStatus,
        pendingUploadCount: state.pendingUploadCount,
        lastError: state.lastError,
      });
    });

    this.connectivity.subscribe((isOnline) => {
      this.setState({ isOnline });
    });
  }

  async triggerSync(): Promise<SyncResult> {
    this.setState({ isSyncing: true, lastError: null });
    try {
      const result = await this.syncManager.sync();
      const syncState = await this.syncManager.getSyncState();
      this.setState({
        isSyncing: false,
        lastSyncTime: syncState.lastSyncTime,
        lastSyncStatus: syncState.lastSyncStatus,
        pendingUploadCount: syncState.pendingUploadCount,
        lastError: syncState.lastError,
      });
      return result;
    } catch (err) {
      this.setState({
        isSyncing: false,
        lastSyncStatus: 'ERROR',
        lastError: (err as Error).message,
      });
      return { status: 'ERROR', error: (err as Error).message };
    }
  }
}

export const syncStore = new SyncStore();

export function useSyncStore(): SyncStoreState & {
  triggerSync: () => Promise<SyncResult>;
} {
  const [state, setLocalState] = useState<SyncStoreState>(syncStore.getState());

  useEffect(() => {
    syncStore.init().catch(() => {});
    return syncStore.subscribe(() => {
      setLocalState(syncStore.getState());
    });
  }, []);

  return {
    ...state,
    triggerSync: () => syncStore.triggerSync(),
  };
}
