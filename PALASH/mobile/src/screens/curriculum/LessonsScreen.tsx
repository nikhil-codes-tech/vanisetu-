/**
 * PALASH Lessons Screen
 * Displays lessons for a learning outcome.
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
import { curriculumRepository, lessonRepository } from '../../database';
import { LessonRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const LessonsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRoute } = navigation;
  const { isOnline } = useSyncStore();

  const params = currentRoute.params as { outcomeId: number; outcomeTitle: string } | undefined;
  const outcomeId = params?.outcomeId || 1;
  const outcomeTitle = params?.outcomeTitle || 'Outcome';

  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadLessons = async () => {
    try {
      if (isOnline) {
        try {
          const remote = await defaultApiClient.get<any[]>(
            `/curriculum/learning-outcomes/${outcomeId}/lessons`
          );
          if (Array.isArray(remote) && remote.length > 0) {
            for (const l of remote) {
              await lessonRepository.saveLesson({
                id: l.id,
                learning_outcome_id: l.learning_outcome_id,
                title: l.title,
                lesson_number: l.lesson_number,
                source_language: l.source_language || 'hi',
                duration_minutes: l.duration_minutes ?? 30,
                teacher_script: l.teacher_script ?? null,
                learning_objective: l.learning_objective ?? null,
                is_active: l.is_active ? 1 : 0,
              });
            }
          }
        } catch {
          // Offline fallback
        }
      }

      const local = await curriculumRepository.getLessons(outcomeId);
      setLessons(local);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [outcomeId, isOnline]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLessons();
  };

  const renderLesson = ({ item }: { item: LessonRecord }) => (
    <Card
      testID={`lesson-card-${item.id}`}
      style={styles.card}
      onPress={() =>
        navigation.navigate('LessonDetail', {
          lessonId: item.id,
          lessonTitle: item.title,
        })
      }
    >
      <View style={styles.topRow}>
        <View style={styles.numBadge}>
          <Text style={styles.numText}>L{item.lesson_number}</Text>
        </View>
        <Text style={styles.durationText}>⏱ {item.duration_minutes || 30} mins</Text>
      </View>

      <Text style={styles.lessonTitle}>{item.title}</Text>
      {item.learning_objective ? (
        <Text style={styles.objectiveText} numberOfLines={2}>
          🎯 {item.learning_objective}
        </Text>
      ) : null}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.worksheetShortcut}
          onPress={(e) => {
            e.stopPropagation?.();
            navigation.navigate('WorksheetList', {
              lessonId: item.id,
              lessonTitle: item.title,
            });
          }}
        >
          <Text style={styles.shortcutText}>📝 Worksheets</Text>
        </TouchableOpacity>

        <Text style={styles.viewPlanText}>View Lesson Plan ›</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Lessons" subtitle={outcomeTitle} />
      <OfflineBanner />

      {loading ? (
        <LoadingIndicator message="Loading lessons..." />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLesson}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState
              title="No Lessons"
              message={`No lessons found for this learning outcome.`}
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
  card: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  numBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  numText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  objectiveText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  worksheetShortcut: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  viewPlanText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
});
