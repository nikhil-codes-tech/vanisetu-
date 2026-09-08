/**
 * PALASH Local Sync Queue Repository & Manager
 * Manages the offline mutation queue in SQLite with safe retries and status tracking.
 */

import { getDatabase } from '../database/db';
import { SyncQueueRecord, SyncOperation, SyncMetadataRecord } from '../database/types/database';

export interface EnqueueParams {
  entity_type: string;
  entity_id: number;
  operation: SyncOperation;
  payload: unknown;
}

export class SyncQueueManager {
  /**
   * Enqueues a local operation for server synchronization.
   */
  async enqueue(params: EnqueueParams): Promise<SyncQueueRecord> {
    const db = getDatabase();
    const payloadStr = typeof params.payload === 'string' ? params.payload : JSON.stringify(params.payload);

    const res = await db.execute(
      `INSERT INTO sync_queue (entity_type, entity_id, operation, payload, status, retry_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'PENDING', 0, datetime('now'), datetime('now'));`,
      [params.entity_type, params.entity_id, params.operation, payloadStr]
    );

    const id = res.insertId || 0;
    const fetchRes = await db.execute('SELECT * FROM sync_queue WHERE id = ? LIMIT 1;', [id]);
    if (fetchRes.rows.length > 0) {
      return fetchRes.rows[0] as SyncQueueRecord;
    }

    return {
      id,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      operation: params.operation,
      payload: payloadStr,
      status: 'PENDING',
      retry_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Retrieves pending or failed (retryable) operations in chronological order.
   */
  async getPendingItems(limit: number = 50): Promise<SyncQueueRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM sync_queue
       WHERE status IN ('PENDING', 'FAILED')
       ORDER BY id ASC
       LIMIT ?;`,
      [limit]
    );
    return res.rows as SyncQueueRecord[];
  }

  /**
   * Marks a queue item as currently in-flight.
   */
  async markInProgress(id: number): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `UPDATE sync_queue SET status = 'IN_PROGRESS', updated_at = datetime('now') WHERE id = ?;`,
      [id]
    );
  }

  /**
   * Marks a queue item as successfully synchronized.
   */
  async markCompleted(id: number): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `UPDATE sync_queue SET status = 'COMPLETED', updated_at = datetime('now') WHERE id = ?;`,
      [id]
    );
  }

  /**
   * Marks a queue item as failed with error details, incrementing retry count.
   * Preserves queue item for future retry.
   */
  async markFailed(id: number, errorMessage: string): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `UPDATE sync_queue
       SET status = 'FAILED',
           retry_count = retry_count + 1,
           error_message = ?,
           updated_at = datetime('now')
       WHERE id = ?;`,
      [errorMessage, id]
    );
  }

  /**
   * Resets any items stuck in 'IN_PROGRESS' back to 'PENDING' (e.g. after crash/restart).
   */
  async resetInProgress(): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `UPDATE sync_queue SET status = 'PENDING', updated_at = datetime('now') WHERE status = 'IN_PROGRESS';`
    );
  }

  /**
   * Returns current counts by queue status.
   */
  async getQueueStatus(): Promise<{ pending: number; inProgress: number; failed: number; completed: number }> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT status, COUNT(*) as count FROM sync_queue GROUP BY status;`
    );

    const counts: Record<string, number> = {
      PENDING: 0,
      IN_PROGRESS: 0,
      FAILED: 0,
      COMPLETED: 0,
    };

    for (const row of res.rows as { status: string; count: number }[]) {
      if (counts[row.status] !== undefined) {
        counts[row.status] = Number(row.count) || 0;
      }
    }

    return {
      pending: counts.PENDING,
      inProgress: counts.IN_PROGRESS,
      failed: counts.FAILED,
      completed: counts.COMPLETED,
    };
  }

  /**
   * Records last sync timestamp and status for an entity type.
   */
  async updateLastSyncTime(entityType: string, status: string): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT INTO sync_metadata (entity_type, last_synced_at, last_sync_status)
       VALUES (?, datetime('now'), ?)
       ON CONFLICT(entity_type) DO UPDATE SET
         last_synced_at = datetime('now'),
         last_sync_status = excluded.last_sync_status;`,
      [entityType, status]
    );
  }

  /**
   * Gets the last successful synchronization timestamp.
   */
  async getLastSyncTime(entityType: string = 'GLOBAL'): Promise<string | null> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT last_synced_at FROM sync_metadata WHERE entity_type = ? LIMIT 1;`,
      [entityType]
    );
    if (res.rows.length === 0) {
      return null;
    }
    return (res.rows[0] as { last_synced_at?: string }).last_synced_at || null;
  }

  /**
   * Retrieves all sync queue items regardless of status for UI diagnostics.
   */
  async getAllItems(limit: number = 100): Promise<SyncQueueRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM sync_queue ORDER BY id DESC LIMIT ?;`,
      [limit]
    );
    return res.rows as SyncQueueRecord[];
  }

  /**
   * Resets a specific failed queue item to PENDING for manual retry.
   */
  async resetFailedItem(id: number): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `UPDATE sync_queue
       SET status = 'PENDING',
           error_message = NULL,
           updated_at = datetime('now')
       WHERE id = ?;`,
      [id]
    );
  }

  /**
   * Purges completed synchronization records to reclaim local storage space.
   */
  async clearCompleted(): Promise<number> {
    const db = getDatabase();
    const res = await db.execute(
      `DELETE FROM sync_queue WHERE status = 'COMPLETED';`
    );
    return res.rowsAffected || 0;
  }

  /**
   * Retrieves all synchronization metadata entries.
   */
  async getAllSyncMetadata(): Promise<SyncMetadataRecord[]> {
    const db = getDatabase();
    const res = await db.execute(
      `SELECT * FROM sync_metadata ORDER BY entity_type ASC;`
    );
    return res.rows as SyncMetadataRecord[];
  }
}

export const defaultSyncQueue = new SyncQueueManager();
