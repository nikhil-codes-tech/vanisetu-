/**
 * PALASH Sync Center & Queue Diagnostics Screen
 * Real-time queue inspection, manual retry, conflict monitoring & offline storage metrics.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '../../navigation/NavigationContext';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { defaultSyncQueue } from '../../sync/syncQueue';
import { defaultSyncManager } from '../../sync/SyncManager';
import { SyncQueueRecord, SyncMetadataRecord } from '../../database/types/database';
import { getDatabase } from '../../database/db';

export const SyncCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [queueStatus, setQueueStatus] = useState({ pending: 0, inProgress: 0, failed: 0, completed: 0 });
  const [queueItems, setQueueItems] = useState<SyncQueueRecord[]>([]);
  const [metadataList, setMetadataList] = useState<SyncMetadataRecord[]>([]);
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    try {
      setIsLoading(true);
      // 1. Queue Status & Items
      const status = await defaultSyncQueue.getQueueStatus();
      setQueueStatus(status);

      const items = await defaultSyncQueue.getAllItems(30);
      setQueueItems(items);

      // 2. Metadata Records
      const meta = await defaultSyncQueue.getAllSyncMetadata();
      setMetadataList(meta);

      // 3. Local SQLite Table Storage Counts
      const db = getDatabase();
      const counts: Record<string, number> = {};
      const tables = [
        'students',
        'student_attendance',
        'student_evaluations',
        'dictionary_entries',
        'worksheets',
        'lessons',
        'sync_queue',
      ];

      for (const tbl of tables) {
        try {
          const res = await db.execute(`SELECT COUNT(*) as count FROM ${tbl};`);
          counts[tbl] = (res.rows[0] as { count: number })?.count || 0;
        } catch {
          counts[tbl] = 0;
        }
      }
      setTableCounts(counts);
    } catch (err) {
      console.warn('Diagnostics fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      const res = await defaultSyncManager.sync();
      await loadDiagnostics();
      if (res.status === 'SUCCESS') {
        const upCount = res.uploadResult?.succeeded || 0;
        const down = res.downloadStats;
        const downCount = down
          ? (down.schools + down.teachers + down.classes + down.subjects + down.lessons + (down.students || 0) + (down.dictionary || 0))
          : 0;
        Alert.alert(
          'Sync Successful',
          `Uploaded ${upCount} changes, downloaded ${downCount} updates.`
        );
      } else {
        Alert.alert('Sync Status: ' + res.status, res.error || 'Sync status: ' + res.status);
      }
    } catch (err: any) {
      Alert.alert('Sync Error', err?.message || 'Failed to complete synchronization.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetryItem = async (id: number) => {
    try {
      await defaultSyncQueue.resetFailedItem(id);
      await loadDiagnostics();
      Alert.alert('Success', `Item #${id} reset to PENDING. Trigger sync to retry.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to reset queue item.');
    }
  };

  const handleClearCompleted = async () => {
    try {
      const removed = await defaultSyncQueue.clearCompleted();
      await loadDiagnostics();
      Alert.alert('Cleaned', `Removed ${removed} completed sync records.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to clear completed items.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="सिंक केंद्र (Sync Center)"
        subtitle="ऑफ़लाइन कतार एवं डेटाबेस निदान (Queue & Diagnostics)"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Queue Metrics Summary */}
        <Card style={styles.metricsCard}>
          <Text style={styles.cardHeading}>कतार स्थिति (Queue Summary)</Text>
          <View style={styles.grid}>
            <View style={[styles.gridCol, { borderLeftColor: '#f59e0b' }]}>
              <Text style={styles.gridValue}>{queueStatus.pending}</Text>
              <Text style={styles.gridLabel}>लंबित (Pending)</Text>
            </View>
            <View style={[styles.gridCol, { borderLeftColor: '#3b82f6' }]}>
              <Text style={styles.gridValue}>{queueStatus.inProgress}</Text>
              <Text style={styles.gridLabel}>प्रगति पर (In Flight)</Text>
            </View>
            <View style={[styles.gridCol, { borderLeftColor: '#ef4444' }]}>
              <Text style={styles.gridValue}>{queueStatus.failed}</Text>
              <Text style={styles.gridLabel}>विफल (Failed)</Text>
            </View>
            <View style={[styles.gridCol, { borderLeftColor: '#10b981' }]}>
              <Text style={styles.gridValue}>{queueStatus.completed}</Text>
              <Text style={styles.gridLabel}>पूर्ण (Completed)</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.buttonRow}>
            <View style={{ flex: 1 }}>
              <Button
                title={isSyncing ? 'सिंक हो रहा है...' : '🔄 अभी सिंक करें (Sync Now)'}
                onPress={handleSyncNow}
                disabled={isSyncing}
                style={{ backgroundColor: '#4f46e5' }}
              />
            </View>
            <TouchableOpacity
              style={styles.cleanButton}
              onPress={handleClearCompleted}
              testID="btn-clear-completed"
            >
              <Text style={styles.cleanButtonText}>साफ़ करें (Purge Done)</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Local SQLite Storage Metrics */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardHeading}>लोकल डेटाबेस भंडारण (Local SQLite Storage)</Text>
          <View style={styles.tableGrid}>
            {Object.entries(tableCounts).map(([table, count]) => (
              <View key={table} style={styles.tableRow}>
                <Text style={styles.tableName}>{table}</Text>
                <Text style={styles.tableCount}>{count} records</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Entity Sync Timestamps */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardHeading}>अंतिम सिंक समय (Entity Sync Timestamps)</Text>
          {metadataList.length === 0 ? (
            <Text style={styles.emptyNotice}>अभी तक कोई सिंक मेटाडेटा दर्ज नहीं है।</Text>
          ) : (
            metadataList.map((meta) => (
              <View key={meta.entity_type} style={styles.metaRow}>
                <View>
                  <Text style={styles.metaType}>{meta.entity_type}</Text>
                  <Text style={styles.metaDate}>
                    {meta.last_synced_at ? new Date(meta.last_synced_at).toLocaleString() : 'Never'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    meta.last_sync_status === 'SUCCESS' ? styles.statusSuccess : styles.statusIdle,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{meta.last_sync_status}</Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* Recent Queue Operations */}
        <Card style={styles.sectionCard}>
          <Text style={styles.cardHeading}>हालिया कतार प्रविष्टियां (Recent Queue Items)</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#4f46e5" style={{ marginVertical: 20 }} />
          ) : queueItems.length === 0 ? (
            <Text style={styles.emptyNotice}>कतार पूरी तरह खाली है (Queue is empty).</Text>
          ) : (
            queueItems.map((item) => (
              <View key={item.id} style={styles.queueItemCard} testID={`queue-item-${item.id}`}>
                <View style={styles.queueHeader}>
                  <Text style={styles.queueTitle}>
                    #{item.id} • {item.entity_type.toUpperCase()} ({item.operation})
                  </Text>
                  <Text
                    style={[
                      styles.queueStatusText,
                      item.status === 'COMPLETED'
                        ? { color: '#10b981' }
                        : item.status === 'FAILED'
                        ? { color: '#ef4444' }
                        : { color: '#f59e0b' },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

                {item.error_message ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>त्रुटि: {item.error_message}</Text>
                  </View>
                ) : null}

                <View style={styles.queueFooter}>
                  <Text style={styles.queueMeta}>
                    पुनः प्रयास (Retries): {item.retry_count} • {item.updated_at || item.created_at}
                  </Text>
                  {item.status === 'FAILED' && (
                    <TouchableOpacity
                      style={styles.retryBtn}
                      onPress={() => handleRetryItem(item.id)}
                      testID={`retry-btn-${item.id}`}
                    >
                      <Text style={styles.retryBtnText}>पुनः प्रयास (Retry)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  metricsCard: {
    padding: 14,
    marginBottom: 14,
  },
  sectionCard: {
    padding: 14,
    marginBottom: 14,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  gridCol: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  gridLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cleanButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cleanButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  tableGrid: {
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  tableCount: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metaType: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  metaDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusSuccess: {
    backgroundColor: '#ecfdf5',
  },
  statusIdle: {
    backgroundColor: '#f1f5f9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  emptyNotice: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  queueItemCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  queueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  queueStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    padding: 6,
    marginVertical: 4,
  },
  errorText: {
    fontSize: 11,
    color: '#b91c1c',
  },
  queueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  queueMeta: {
    fontSize: 11,
    color: '#64748b',
  },
  retryBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  retryBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
});
