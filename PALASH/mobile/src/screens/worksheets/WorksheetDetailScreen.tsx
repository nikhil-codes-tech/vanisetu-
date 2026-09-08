/**
 * PALASH Worksheet Detail & Question Viewer Screen
 * Displays questions, answer options, marks, and explanations. Works offline via SQLite.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { LoadingIndicator, EmptyState } from '../../components/LoadingIndicator';
import { useNavigation } from '../../navigation/NavigationContext';
import { useSyncStore } from '../../store/syncStore';
import { worksheetRepository, worksheetQuestionRepository } from '../../database';
import {
  WorksheetRecord,
  WorksheetQuestionRecord,
} from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const WorksheetDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRoute } = navigation;
  const { isOnline } = useSyncStore();

  const params = currentRoute.params as { worksheetId: number; worksheetTitle: string } | undefined;
  const worksheetId = params?.worksheetId || 1;
  const worksheetTitle = params?.worksheetTitle || 'Worksheet';

  const [worksheet, setWorksheet] = useState<WorksheetRecord | null>(null);
  const [questions, setQuestions] = useState<WorksheetQuestionRecord[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  const loadWorksheetData = async () => {
    try {
      if (isOnline) {
        try {
          const remoteQuestions = await defaultApiClient.get<any[]>(
            `/worksheets/${worksheetId}/questions`
          );
          if (Array.isArray(remoteQuestions) && remoteQuestions.length > 0) {
            for (const q of remoteQuestions) {
              await worksheetQuestionRepository.saveQuestion({
                id: q.id,
                worksheet_id: q.worksheet_id,
                question_number: q.question_number,
                question_text: q.question_text,
                question_type: q.question_type,
                options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options || []),
                correct_answer: q.correct_answer ?? null,
                explanation: q.explanation ?? null,
                marks: q.marks ?? 1,
              });
            }
          }
        } catch {
          // Offline fallback
        }
      }

      const ws = await worksheetRepository.getWorksheet(worksheetId);
      setWorksheet(ws);

      const qs = await worksheetRepository.getQuestionsByWorksheet(worksheetId);
      setQuestions(qs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorksheetData();
  }, [worksheetId, isOnline]);

  const toggleAnswer = (questionId: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const parseOptions = (optionsRaw?: string | null): string[] => {
    if (!optionsRaw) return [];
    try {
      const parsed = JSON.parse(optionsRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return optionsRaw.split(',').map((o) => o.trim());
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={worksheetTitle} />
        <LoadingIndicator message="Loading worksheet questions..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={worksheetTitle} subtitle="Questions & Answers" />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Worksheet Overview Header */}
        {worksheet?.instructions ? (
          <Card style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Teacher Instructions</Text>
            <Text style={styles.instructionsText}>{worksheet.instructions}</Text>
          </Card>
        ) : null}

        <View style={styles.questionsHeader}>
          <Text style={styles.questionsTitle}>Questions ({questions.length})</Text>
        </View>

        {questions.length === 0 ? (
          <EmptyState
            title="No Questions"
            message="This worksheet does not contain any questions yet."
          />
        ) : (
          questions.map((q, idx) => {
            const isRevealed = !!revealedAnswers[q.id || idx];
            const options = parseOptions(q.options);

            return (
              <Card key={q.id || idx} style={styles.questionCard}>
                <View style={styles.questionTopRow}>
                  <View style={styles.qNumBadge}>
                    <Text style={styles.qNumText}>Q{q.question_number || idx + 1}</Text>
                  </View>
                  <Text style={styles.marksText}>{q.marks || 1} mark</Text>
                </View>

                <Text style={styles.questionText}>{q.question_text}</Text>

                {/* MCQ Options */}
                {options.length > 0 && (
                  <View style={styles.optionsContainer}>
                    {options.map((opt, optIdx) => (
                      <View key={optIdx} style={styles.optionRow}>
                        <View style={styles.radioDot} />
                        <Text style={styles.optionText}>{opt}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Reveal Answer Section */}
                <View style={styles.answerSection}>
                  <TouchableOpacity
                    style={styles.revealButton}
                    onPress={() => toggleAnswer(q.id || idx)}
                  >
                    <Text style={styles.revealButtonText}>
                      {isRevealed ? 'Hide Answer ▲' : 'Show Answer & Explanation ▼'}
                    </Text>
                  </TouchableOpacity>

                  {isRevealed && (
                    <View style={styles.answerBox}>
                      <Text style={styles.answerLabel}>Correct Answer:</Text>
                      <Text style={styles.answerValue}>
                        {q.correct_answer || 'No answer specified'}
                      </Text>

                      {q.explanation && (
                        <Text style={styles.explanationText}>
                          💡 {q.explanation}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  instructionsCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    marginBottom: 16,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  questionsHeader: {
    marginBottom: 12,
  },
  questionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  questionCard: {
    padding: 18,
    marginBottom: 14,
  },
  questionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qNumBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  marksText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
    marginBottom: 10,
  },
  optionsContainer: {
    marginVertical: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    marginBottom: 4,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginRight: 10,
  },
  optionText: {
    fontSize: 13,
    color: '#374151',
  },
  answerSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  revealButton: {
    paddingVertical: 4,
  },
  revealButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  answerBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  answerValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
    marginTop: 2,
  },
  explanationText: {
    fontSize: 12,
    color: '#166534',
    marginTop: 6,
    lineHeight: 16,
  },
});
