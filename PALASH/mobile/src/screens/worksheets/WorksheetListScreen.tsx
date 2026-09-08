/**
 * PALASH Worksheet List Screen
 * Displays worksheets aligned with a lesson. Works online and offline via SQLite.
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
import { worksheetRepository } from '../../database';
import { WorksheetRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const WorksheetListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRoute } = navigation;
  const { isOnline } = useSyncStore();

  const params = currentRoute.params as { lessonId?: number; lessonTitle?: string } | undefined;
  const lessonId = params?.lessonId || 1;
  const lessonTitle = params?.lessonTitle || 'Lesson';

  const [worksheets, setWorksheets] = useState<WorksheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorksheets = async () => {
    try {
      if (isOnline) {
        try {
          const remote = await defaultApiClient.get<any[]>(`/lessons/${lessonId}/worksheets`);
          if (Array.isArray(remote) && remote.length > 0) {
            for (const ws of remote) {
              await worksheetRepository.saveWorksheet({
                id: ws.id,
                lesson_id: ws.lesson_id,
                title: ws.title,
                description: ws.description ?? null,
                language_code: ws.language_code || 'hi',
                source_language: ws.source_language || 'hi',
                worksheet_type: ws.worksheet_type,
                difficulty_level: ws.difficulty_level ?? 'beginner',
                instructions: ws.instructions ?? null,
                content: ws.content ?? null,
                answer_key: ws.answer_key ?? null,
                file_path: ws.file_path ?? null,
                version: ws.version ?? 1,
                is_active: ws.is_active ? 1 : 0,
              });
            }
          }
        } catch {
          // Offline fallback
        }
      }

      const local = await worksheetRepository.getWorksheets(lessonId);
      setWorksheets(local);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWorksheets();
  }, [lessonId, isOnline]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorksheets();
  };

  const renderWorksheet = ({ item }: { item: WorksheetRecord }) => (
    <Card
      testID={`worksheet-card-${item.id}`}
      style={styles.card}
      onPress={() =>
        navigation.navigate('WorksheetDetail', {
          worksheetId: item.id,
          worksheetTitle: item.title,
        })
      }
    >
      <View style={styles.badgeRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.worksheet_type.toUpperCase()}</Text>
        </View>

        <View style={styles.diffBadge}>
          <Text style={styles.diffText}>{item.difficulty_level || 'beginner'}</Text>
        </View>

        <View style={styles.langBadge}>
          <Text style={styles.langText}>
            {item.source_language.toUpperCase()} ↔ {item.language_code.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={styles.versionText}>v{item.version || 1}</Text>
        <Text style={styles.viewQuestionsText}>View Questions ›</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Worksheets" subtitle={lessonTitle} />
      <OfflineBanner />

      {loading ? (
        <LoadingIndicator message="Loading worksheets..." />
      ) : (
        <FlatList
          data={worksheets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWorksheet}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState
              title="No Worksheets"
              message={`No worksheets created for this lesson yet.`}
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
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  diffBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  diffText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
    textTransform: 'capitalize',
  },
  langBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  langText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  versionText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  viewQuestionsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
});
