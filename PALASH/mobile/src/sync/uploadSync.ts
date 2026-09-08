/**
 * PALASH Upstream Synchronization Service (SQLite Queue -> Server)
 * Flushes pending mutations from sync_queue to FastAPI, marking successes
 * as COMPLETED and failures as FAILED (retaining for safe retries).
 */

import { ApiClient } from '../services/api';
import { SyncQueueManager } from './syncQueue';
import { SyncQueueRecord } from '../database/types/database';

export interface UploadSyncResult {
  totalProcessed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: number; error: string }>;
}

export class UploadSynchronizer {
  private api: ApiClient;
  private queue: SyncQueueManager;

  constructor(api: ApiClient, queue: SyncQueueManager) {
    this.api = api;
    this.queue = queue;
  }

  /**
   * Processes all pending and retryable items from the sync queue.
   */
  async flushQueue(batchSize: number = 50): Promise<UploadSyncResult> {
    const items = await this.queue.getPendingItems(batchSize);
    const result: UploadSyncResult = {
      totalProcessed: items.length,
      succeeded: 0,
      failed: 0,
      errors: [],
    };

    for (const item of items) {
      await this.queue.markInProgress(item.id);

      try {
        await this.syncItem(item);
        await this.queue.markCompleted(item.id);
        result.succeeded++;
      } catch (err) {
        const errorMsg = (err as Error).message || 'Unknown synchronization error';
        await this.queue.markFailed(item.id, errorMsg);
        result.failed++;
        result.errors.push({ id: item.id, error: errorMsg });
      }
    }

    return result;
  }

  /**
   * Dispatches a single queue item to its corresponding FastAPI endpoint.
   */
  private async syncItem(item: SyncQueueRecord): Promise<void> {
    const payload = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload;

    switch (item.entity_type.toLowerCase()) {
      case 'teacher': {
        if (item.operation === 'UPDATE') {
          await this.api.put('/teachers/me', payload);
        }
        break;
      }

      case 'worksheet': {
        if (item.operation === 'CREATE') {
          await this.api.post('/worksheets', payload);
        } else if (item.operation === 'UPDATE') {
          await this.api.put(`/worksheets/${item.entity_id}`, payload);
        } else if (item.operation === 'DELETE') {
          await this.api.delete(`/worksheets/${item.entity_id}`);
        }
        break;
      }

      case 'worksheet_question': {
        if (item.operation === 'CREATE') {
          const worksheetId = payload.worksheet_id || item.entity_id;
          await this.api.post(`/worksheets/${worksheetId}/questions`, payload);
        }
        break;
      }

      case 'student': {
        if (item.operation === 'CREATE') {
          await this.api.post('/students', payload);
        } else if (item.operation === 'UPDATE') {
          await this.api.put(`/students/${item.entity_id}`, payload);
        }
        break;
      }

      case 'dictionary_entry': {
        if (item.operation === 'CREATE') {
          await this.api.post('/dictionary', payload);
        } else if (item.operation === 'UPDATE') {
          await this.api.put(`/dictionary/${item.entity_id}`, payload);
        }
        break;
      }

      case 'attendance':
      case 'student_attendance': {
        if (item.operation === 'CREATE' || item.operation === 'UPDATE') {
          if (Array.isArray(payload)) {
            await this.api.post('/attendance/bulk', {
              school_id: payload[0]?.school_id || 1,
              attendance_date: payload[0]?.attendance_date || new Date().toISOString().split('T')[0],
              records: payload.map((p) => ({
                student_id: p.student_id,
                status: p.status,
                remarks: p.remarks,
              })),
            });
          } else if (payload.records) {
            await this.api.post('/attendance/bulk', payload);
          } else {
            await this.api.post('/attendance', payload);
          }
        }
        break;
      }

      default: {
        // Generic fallback for future entities
        const endpoint = `/${item.entity_type.toLowerCase()}s`;
        if (item.operation === 'CREATE') {
          await this.api.post(endpoint, payload);
        } else if (item.operation === 'UPDATE') {
          await this.api.put(`${endpoint}/${item.entity_id}`, payload);
        } else if (item.operation === 'DELETE') {
          await this.api.delete(`${endpoint}/${item.entity_id}`);
        }
      }
    }
  }
}

