/**
 * PALASH Classes Screen
 * Displays active curriculum classes. Reads from FastAPI or local SQLite cache.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { LoadingIndicator, EmptyState } from '../../components/LoadingIndicator';
import { useNavigation } from '../../navigation/NavigationContext';
import { useSyncStore } from '../../store/syncStore';
import { curriculumRepository, curriculumClassRepository } from '../../database';
import { CurriculumClassRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const ClassesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isOnline, isSyncing, triggerSync } = useSyncStore();

  const [classes, setClasses] = useState<CurriculumClassRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadClasses = async () => {
    try {
      if (isOnline) {
        try {
          const remoteClasses = await defaultApiClient.get<any[]>('/curriculum/classes');
          if (Array.isArray(remoteClasses) && remoteClasses.length > 0) {
            for (const c of remoteClasses) {
              await curriculumClassRepository.saveClass({
                id: c.id,
                name: c.name,
                grade: c.grade,
                description: c.description ?? null,
                is_active: c.is_active ? 1 : 0,
              });
            }
          }
        } catch {
          // Non-blocking fallback to local SQLite
        }
      }

      const localClasses = await curriculumRepository.getClasses();
      setClasses(localClasses);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [isOnline]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (isOnline) {
      await triggerSync();
    }
    await loadClasses();
  };

  const renderClassItem = ({ item }: { item: CurriculumClassRecord }) => (
    <Card
      testID={`class-card-${item.id}`}
      style={styles.classCard}
      onPress={() =>
        navigation.navigate('Subjects', { classId: item.id, className: item.name })
      }
    >
      <View style={styles.classCardRow}>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeNumber}>{item.grade}</Text>
          <Text style={styles.gradeLabel}>Grade</Text>
        </View>

        <View style={styles.classInfo}>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classDescription}>
            {item.description || 'Mother tongue-based multilingual curriculum'}
          </Text>
        </View>

        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Curriculum Classes" />
      <OfflineBanner />

      {loading ? (
        <LoadingIndicator message="Loading classes..." />
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderClassItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing || isSyncing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Classes Found"
              message="No curriculum classes are stored in your local offline database. Connect to the internet and sync to download."
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  classCard: {
    padding: 16,
  },
  classCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeBadge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  gradeNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4F46E5',
  },
  gradeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6366F1',
    textTransform: 'uppercase',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  classDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    marginLeft: 8,
  },
});
