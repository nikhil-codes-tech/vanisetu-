/**
 * PALASH Offline Banner Component
 * Displays a subtle status notification when running offline using local SQLite data.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSyncStore } from '../store/syncStore';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingUploadCount } = useSyncStore();

  if (isOnline) {
    if (pendingUploadCount > 0) {
      return (
        <View style={styles.syncNotice}>
          <Text style={styles.syncNoticeText}>
            ⚡ {pendingUploadCount} offline {pendingUploadCount === 1 ? 'change' : 'changes'} pending sync.
          </Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>
        📡 Offline Mode — Reading from local SQLite cache.
        {pendingUploadCount > 0 && ` (${pendingUploadCount} pending)`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  syncNotice: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
    alignItems: 'center',
  },
  syncNoticeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#3730A3',
  },
});
