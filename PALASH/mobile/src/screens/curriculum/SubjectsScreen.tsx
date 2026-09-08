/**
 * PALASH Subjects Screen
 * Displays subjects associated with a class. Supports online sync and offline SQLite reads.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { LoadingIndicator, EmptyState } from '../../components/LoadingIndicator';
import { useNavigation } from '../../navigation/NavigationContext';
import { useSyncStore } from '../../store/syncStore';
import { curriculumRepository, subjectRepository } from '../../database';
import { SubjectRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const SubjectsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRoute } = navigation;
  const { isOnline } = useSyncStore();

  const params = currentRoute.params as { classId: number; className: string } | undefined;
  const classId = params?.classId || 1;
  const className = params?.className || 'Class';

  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadSubjects = async () => {
    try {
      if (isOnline) {
        try {
          const remote = await defaultApiClient.get<any[]>(`/curriculum/classes/${classId}/subjects`);
          if (Array.isArray(remote) && remote.length > 0) {
            for (const s of remote) {
              await subjectRepository.saveSubject({
                id: s.id,
                class_id: s.class_id,
                name: s.name,
                code: s.code,
                description: s.description ?? null,
                is_active: s.is_active ? 1 : 0,
              });
            }
          }
        } catch {
          // Offline fallback
        }
      }

      const local = await curriculumRepository.getSubjects(classId);
      setSubjects(local);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [classId, isOnline]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubjects();
  };

  const renderSubject = ({ item }: { item: SubjectRecord }) => (
    <Card
      testID={`subject-card-${item.id}`}
      style={styles.subjectCard}
      onPress={() =>
        navigation.navigate('LearningOutcomes', {
          subjectId: item.id,
          subjectName: item.name,
        })
      }
    >
      <View style={styles.subjectRow}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{item.code || 'SUB'}</Text>
        </View>

        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={styles.subjectDesc}>
            {item.description || 'Core language and foundational subject'}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Subjects" subtitle={className} />
      <OfflineBanner />

      {loading ? (
        <LoadingIndicator message="Loading subjects..." />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSubject}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState
              title="No Subjects"
              message={`No subjects found for ${className}. Connect online and sync or check local database.`}
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
  subjectCard: {
    padding: 16,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subjectDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
    marginLeft: 8,
  },
});
