/**
 * PALASH Stage 2.10 Sync Center & Queue Diagnostics Tests
 * Verifies queue status metrics, failed item reset, completed item purging, and storage metrics.
 */

import initSqlJs from 'sql.js';
import {
  initializeDatabase,
  closeDatabase,
  SqlJsDriver,
  getDatabase,
} from '../src/database';
import { SyncQueueManager } from '../src/sync/syncQueue';

describe('PALASH Stage 2.10 Sync Center & Queue Diagnostics', () => {
  let sqlJsInstance: any;
  let SQL: any;
  let queueManager: SyncQueueManager;

  beforeEach(async () => {
    SQL = await initSqlJs();
    sqlJsInstance = new SQL.Database();
    const driver = new SqlJsDriver(sqlJsInstance);
    await initializeDatabase(driver);
    queueManager = new SyncQueueManager();
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('1. Accurate queue summary status calculation', async () => {
    // Enqueue 2 pending
    const item1 = await queueManager.enqueue({
      entity_type: 'worksheet',
      entity_id: 101,
      operation: 'CREATE',
      payload: { title: 'Test Worksheet' },
    });

    const item2 = await queueManager.enqueue({
      entity_type: 'student_attendance',
      entity_id: 202,
      operation: 'CREATE',
      payload: { attendance_date: '2026-09-07' },
    });

    // Mark one as COMPLETED, one as FAILED
    await queueManager.markCompleted(item1.id);
    await queueManager.markFailed(item2.id, 'Network timeout');

    // Add another pending
    await queueManager.enqueue({
      entity_type: 'dictionary_entry',
      entity_id: 303,
      operation: 'CREATE',
      payload: { source_word: 'Ona' },
    });

    const status = await queueManager.getQueueStatus();
    expect(status.completed).toBe(1);
    expect(status.failed).toBe(1);
    expect(status.pending).toBe(1);
    expect(status.inProgress).toBe(0);
  });

  test('2. Retrieve all queue items for UI inspection', async () => {
    await queueManager.enqueue({
      entity_type: 'worksheet',
      entity_id: 1,
      operation: 'CREATE',
      payload: { title: 'Math 1' },
    });

    await queueManager.enqueue({
      entity_type: 'student',
      entity_id: 2,
      operation: 'UPDATE',
      payload: { full_name: 'Birsa Ho' },
    });

    const items = await queueManager.getAllItems(10);
    expect(items.length).toBe(2);
    expect(items[0].entity_type).toBe('student'); // Order by ID DESC
    expect(items[1].entity_type).toBe('worksheet');
  });

  test('3. Reset failed queue item for manual retry', async () => {
    const item = await queueManager.enqueue({
      entity_type: 'attendance',
      entity_id: 501,
      operation: 'CREATE',
      payload: { student_id: 1 },
    });

    await queueManager.markFailed(item.id, 'Server 500 internal error');

    let allItems = await queueManager.getAllItems(5);
    const failedItem = allItems.find((i) => i.id === item.id);
    expect(failedItem?.status).toBe('FAILED');
    expect(failedItem?.error_message).toBe('Server 500 internal error');

    // Reset item to PENDING
    await queueManager.resetFailedItem(item.id);

    allItems = await queueManager.getAllItems(5);
    const resetItem = allItems.find((i) => i.id === item.id);
    expect(resetItem?.status).toBe('PENDING');
    expect(resetItem?.error_message).toBeNull();
  });

  test('4. Purge completed sync queue records', async () => {
    const item1 = await queueManager.enqueue({
      entity_type: 'worksheet',
      entity_id: 1,
      operation: 'CREATE',
      payload: {},
    });
    const item2 = await queueManager.enqueue({
      entity_type: 'worksheet',
      entity_id: 2,
      operation: 'CREATE',
      payload: {},
    });

    await queueManager.markCompleted(item1.id);
    // item2 stays PENDING

    const deletedCount = await queueManager.clearCompleted();
    expect(deletedCount).toBe(1);

    const remaining = await queueManager.getAllItems(10);
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(item2.id);
  });

  test('5. Sync metadata timestamp and status tracking', async () => {
    await queueManager.updateLastSyncTime('CURRICULUM', 'SUCCESS');
    await queueManager.updateLastSyncTime('DICTIONARY', 'SUCCESS');
    await queueManager.updateLastSyncTime('ATTENDANCE', 'PARTIAL');

    const metaList = await queueManager.getAllSyncMetadata();
    expect(metaList.length).toBe(3);

    const curr = metaList.find((m) => m.entity_type === 'CURRICULUM');
    expect(curr?.last_sync_status).toBe('SUCCESS');
    expect(curr?.last_synced_at).toBeTruthy();

    const att = metaList.find((m) => m.entity_type === 'ATTENDANCE');
    expect(att?.last_sync_status).toBe('PARTIAL');
  });

  test('6. Database diagnostics table record counts', async () => {
    const db = getDatabase();
    const res = await db.execute('SELECT COUNT(*) as count FROM sync_queue;');
    expect((res.rows[0] as { count: number }).count).toBe(0);

    await queueManager.enqueue({
      entity_type: 'test',
      entity_id: 1,
      operation: 'CREATE',
      payload: {},
    });

    const resAfter = await db.execute('SELECT COUNT(*) as count FROM sync_queue;');
    expect((resAfter.rows[0] as { count: number }).count).toBe(1);
  });
});
