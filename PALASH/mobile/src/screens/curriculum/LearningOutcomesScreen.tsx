/**
 * PALASH Learning Outcomes Screen
 * Displays learning outcomes with NIPUN domain indicators for a subject.
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
import { curriculumRepository, learningOutcomeRepository } from '../../database';
import { LearningOutcomeRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const LearningOutcomesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRoute } = navigation;
  const { isOnline } = useSyncStore();

  const params = currentRoute.params as { subjectId: number; subjectName: string } | undefined;
  const subjectId = params?.subjectId || 1;
  const subjectName = params?.subjectName || 'Subject';

  const [outcomes, setOutcomes] = useState<LearningOutcomeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadOutcomes = async () => {
    try {
      if (isOnline) {
        try {
          const remote = await defaultApiClient.get<any[]>(
            `/curriculum/subjects/${subjectId}/learning-outcomes`
          );
          if (Array.isArray(remote) && remote.length > 0) {
            for (const lo of remote) {
              await learningOutcomeRepository.saveLearningOutcome({
                id: lo.id,
                subject_id: lo.subject_id,
                code: lo.code,
                title: lo.title,
                description: lo.description ?? null,
                nipun_domain: lo.nipun_domain ?? null,
                is_active: lo.is_active ? 1 : 0,
              });
            }
          }
        } catch {
          // Offline fallback
        }
      }

      const local = await curriculumRepository.getLearningOutcomes(subjectId);
      setOutcomes(local);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOutcomes();
  }, [subjectId, isOnline]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOutcomes();
  };

  const renderOutcome = ({ item }: { item: LearningOutcomeRecord }) => (
    <Card
      testID={`outcome-card-${item.id}`}
      style={styles.card}
      onPress={() =>
        navigation.navigate('Lessons', {
          outcomeId: item.id,
          outcomeTitle: item.title,
        })
      }
    >
      <View style={styles.topRow}>
        <View style={styles.codePill}>
          <Text style={styles.codeText}>{item.code}</Text>
        </View>
        {item.nipun_domain ? (
          <View style={styles.nipunPill}>
            <Text style={styles.nipunText}>{item.nipun_domain}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.outcomeTitle}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.outcomeDesc}>{item.description}</Text>
      ) : null}

      <View style={styles.actionRow}>
        <Text style={styles.actionPrompt}>Tap to view lesson units</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Learning Outcomes" subtitle={subjectName} />
      <OfflineBanner />

      {loading ? (
        <LoadingIndicator message="Loading learning outcomes..." />
      ) : (
        <FlatList
          data={outcomes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOutcome}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState
              title="No Learning Outcomes"
              message={`No learning outcomes mapped for ${subjectName}.`}
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
    alignItems: 'center',
    marginBottom: 8,
  },
  codePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  nipunPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  nipunText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  outcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  outcomeDesc: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionPrompt: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
});
