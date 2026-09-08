/**
 * PALASH Lesson Detail Screen
 * Displays complete lesson plan including teacher script, activities, and assessments.
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
import { Button } from '../../components/Button';
import { LoadingIndicator, EmptyState } from '../../components/LoadingIndicator';
import { useNavigation } from '../../navigation/NavigationContext';
import { useSyncStore } from '../../store/syncStore';
import { useCurriculumLanguage } from '../../store/languageStore';
import {
  curriculumRepository,
  lessonRepository,
  activityRepository,
  assessmentRepository,
  translationRepository,
} from '../../database';
import {
  LessonRecord,
  ActivityRecord,
  AssessmentRecord,
  LessonTranslationRecord,
  ActivityTranslationRecord,
  AssessmentTranslationRecord,
} from '../../database/types/database';
import { defaultApiClient } from '../../services/api';

export const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentRoute } = navigation;
  const { isOnline } = useSyncStore();
  const { selectedLanguage, setLanguage, availableLanguages } = useCurriculumLanguage();

  const params = currentRoute.params as { lessonId: number; lessonTitle: string } | undefined;
  const lessonId = params?.lessonId || 1;
  const lessonTitle = params?.lessonTitle || 'Lesson Plan';

  const [activeTab, setActiveTab] = useState<'plan' | 'activities' | 'assessments'>('plan');
  const [lesson, setLesson] = useState<LessonRecord | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [lessonTranslation, setLessonTranslation] = useState<LessonTranslationRecord | null>(null);
  const [activityTranslations, setActivityTranslations] = useState<Record<number, ActivityTranslationRecord>>({});
  const [assessmentTranslations, setAssessmentTranslations] = useState<Record<number, AssessmentTranslationRecord>>({});
  const [loading, setLoading] = useState(true);

  const loadLessonData = async () => {
    try {
      if (isOnline) {
        try {
          const remoteActivities = await defaultApiClient.get<any[]>(
            `/curriculum/lessons/${lessonId}/activities`
          );
          if (Array.isArray(remoteActivities)) {
            for (const a of remoteActivities) {
              await activityRepository.saveActivity({
                id: a.id,
                lesson_id: a.lesson_id,
                title: a.title,
                activity_type: a.activity_type,
                instructions: a.instructions ?? null,
                sequence_order: a.sequence_order ?? 1,
                materials: a.materials ?? null,
                is_active: a.is_active ? 1 : 0,
              });
            }
          }

          const remoteAssessments = await defaultApiClient.get<any[]>(
            `/curriculum/lessons/${lessonId}/assessments`
          );
          if (Array.isArray(remoteAssessments)) {
            for (const asmt of remoteAssessments) {
              await assessmentRepository.saveAssessment({
                id: asmt.id,
                lesson_id: asmt.lesson_id,
                title: asmt.title,
                prompt: asmt.prompt,
                assessment_type: asmt.assessment_type,
                sequence_order: asmt.sequence_order ?? 1,
                expected_response: asmt.expected_response ?? null,
                is_active: asmt.is_active ? 1 : 0,
              });
            }
          }

          // Fetch remote translations if online
          const remoteTranslations = await defaultApiClient.get<any[]>(
            `/curriculum/lessons/${lessonId}/translations`
          );
          if (Array.isArray(remoteTranslations)) {
            for (const t of remoteTranslations) {
              await translationRepository.saveLessonTranslation({
                id: t.id,
                lesson_id: t.lesson_id,
                language_code: t.language_code,
                translated_title: t.translated_title,
                translated_script: t.translated_script ?? null,
                translated_objective: t.translated_objective ?? null,
                translated_content: t.translated_content ?? null,
                audio_path: t.audio_path ?? null,
                version: t.version ?? 1,
                is_active: t.is_active ? 1 : 0,
              });
            }
          }
        } catch {
          // Offline fallback
        }
      }

      const localLesson = await lessonRepository.getLesson(lessonId);
      setLesson(localLesson);

      const localActs = await curriculumRepository.getActivities(lessonId);
      setActivities(localActs);

      const localAsmts = await curriculumRepository.getAssessments(lessonId);
      setAssessments(localAsmts);

      // Load translations for selected language
      await loadTranslationsForLanguage(selectedLanguage, localActs, localAsmts);
    } finally {
      setLoading(false);
    }
  };

  const loadTranslationsForLanguage = async (
    lang: string,
    acts: ActivityRecord[] = activities,
    asmts: AssessmentRecord[] = assessments
  ) => {
    if (lang === 'hi') {
      setLessonTranslation(null);
      setActivityTranslations({});
      setAssessmentTranslations({});
      return;
    }

    // Offline lookup in SQLite
    const trans = await translationRepository.getLessonTranslation(lessonId, lang);
    setLessonTranslation(trans);

    const actTransMap: Record<number, ActivityTranslationRecord> = {};
    for (const act of acts) {
      const atList = await translationRepository.getActivityTranslations(act.id, lang);
      if (atList.length > 0) {
        actTransMap[act.id] = atList[0];
      }
    }
    setActivityTranslations(actTransMap);

    const asmtTransMap: Record<number, AssessmentTranslationRecord> = {};
    for (const asmt of asmts) {
      const stList = await translationRepository.getAssessmentTranslations(asmt.id, lang);
      if (stList.length > 0) {
        asmtTransMap[asmt.id] = stList[0];
      }
    }
    setAssessmentTranslations(asmtTransMap);
  };

  useEffect(() => {
    loadLessonData();
  }, [lessonId, isOnline]);

  useEffect(() => {
    loadTranslationsForLanguage(selectedLanguage);
  }, [selectedLanguage]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={lessonTitle} />
        <LoadingIndicator message="Loading lesson details..." />
      </View>
    );
  }

  const isTribalLanguage = selectedLanguage !== 'hi';
  const hasLessonTranslation = !!lessonTranslation;

  return (
    <View style={styles.container}>
      <Header
        title={
          isTribalLanguage && lessonTranslation
            ? lessonTranslation.translated_title
            : lessonTitle
        }
        subtitle="Lesson Details"
      />
      <OfflineBanner />

      {/* Language Selector Bar */}
      <View style={styles.languageBar} testID="language-selector-bar">
        <Text style={styles.languageLabel}>Language:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langPillsContainer}>
          {availableLanguages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                testID={`lang-pill-${lang.code}`}
                style={[styles.langPill, isSelected && styles.langPillActive]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={[styles.langPillText, isSelected && styles.langPillTextActive]}>
                  {lang.name}
                </Text>
                {lang.code !== 'hi' && (
                  <Text style={[styles.langScriptTag, isSelected && styles.langScriptTagActive]}>
                    ({lang.code})
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Missing Translation Notice when tribal language selected but no translation exists */}
      {isTribalLanguage && !hasLessonTranslation && (
        <View style={styles.fallbackNoticeCard} testID="translation-fallback-notice">
          <Text style={styles.fallbackNoticeIcon}>ℹ️</Text>
          <View style={styles.fallbackNoticeContent}>
            <Text style={styles.fallbackNoticeTitle}>Translation not available offline.</Text>
            <Text style={styles.fallbackNoticeText}>
              Displaying source Hindi content. Content will be available once synced.
            </Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          testID="tab-plan"
          style={[styles.tabItem, activeTab === 'plan' && styles.activeTabItem]}
          onPress={() => setActiveTab('plan')}
        >
          <Text style={[styles.tabText, activeTab === 'plan' && styles.activeTabText]}>
            Plan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-activities"
          style={[styles.tabItem, activeTab === 'activities' && styles.activeTabItem]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            Activities ({activities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-assessments"
          style={[styles.tabItem, activeTab === 'assessments' && styles.activeTabItem]}
          onPress={() => setActiveTab('assessments')}
        >
          <Text style={[styles.tabText, activeTab === 'assessments' && styles.activeTabText]}>
            Assessments ({assessments.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* TAB 1: PLAN */}
        {activeTab === 'plan' && (
          <View>
            <Card style={styles.card}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.cardSectionTitle}>Learning Objective</Text>
                {isTribalLanguage && hasLessonTranslation && (
                  <Text style={styles.translatedBadge}>Translated ({selectedLanguage.toUpperCase()})</Text>
                )}
              </View>
              <Text style={styles.objectiveText} testID="lesson-objective-display">
                {isTribalLanguage && lessonTranslation?.translated_objective
                  ? lessonTranslation.translated_objective
                  : lesson?.learning_objective || 'Develop foundational language skills.'}
              </Text>
              <Text style={styles.durationBadge}>⏱ Duration: {lesson?.duration_minutes || 30} mins</Text>
            </Card>

            {(lesson?.teacher_script || lessonTranslation?.translated_script) ? (
              <Card style={styles.card}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.cardSectionTitle}>Teacher Script & Instructions</Text>
                  {isTribalLanguage && lessonTranslation?.translated_script && (
                    <Text style={styles.translatedBadge}>Translated ({selectedLanguage.toUpperCase()})</Text>
                  )}
                </View>
                <Text style={styles.scriptText} testID="lesson-script-display">
                  {isTribalLanguage && lessonTranslation?.translated_script
                    ? lessonTranslation.translated_script
                    : lesson?.teacher_script}
                </Text>
              </Card>
            ) : null}

            <Button
              testID="lesson-worksheets-button"
              title="View Aligned Worksheets"
              onPress={() =>
                navigation.navigate('WorksheetList', {
                  lessonId,
                  lessonTitle,
                })
              }
              style={styles.worksheetsBtn}
            />

            <Button
              testID="lesson-vocab-button"
              title="📖 Lesson Vocabulary (शब्दकोश)"
              onPress={() =>
                navigation.navigate('Dictionary', {
                  lessonId,
                  lessonTitle,
                })
              }
              style={{ ...styles.worksheetsBtn, backgroundColor: '#059669' }}
            />

            <Button
              testID="lesson-create-ws-button"
              title="✍️ + Create New Worksheet"
              onPress={() =>
                navigation.navigate('CreateWorksheet', {
                  lessonId,
                  lessonTitle,
                })
              }
              style={{ ...styles.worksheetsBtn, backgroundColor: '#4b5563' }}
            />
          </View>
        )}

        {/* TAB 2: ACTIVITIES */}
        {activeTab === 'activities' && (
          <View>
            {activities.length === 0 ? (
              <EmptyState title="No Activities" message="No activities recorded for this lesson." />
            ) : (
              activities.map((act, idx) => {
                const actTrans = isTribalLanguage ? activityTranslations[act.id] : null;
                return (
                  <Card key={act.id || idx} style={styles.card}>
                    <View style={styles.actHeader}>
                      <View style={styles.seqBadge}>
                        <Text style={styles.seqText}>Step {act.sequence_order || idx + 1}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {actTrans && (
                          <Text style={styles.translatedTag}>[{selectedLanguage.toUpperCase()}]</Text>
                        )}
                        <Text style={styles.typeBadge}>{act.activity_type.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.actTitle} testID={`activity-title-${act.id}`}>
                      {actTrans?.translated_title || act.title}
                    </Text>
                    {(actTrans?.translated_instructions || act.instructions) ? (
                      <Text style={styles.actInstructions} testID={`activity-instructions-${act.id}`}>
                        {actTrans?.translated_instructions || act.instructions}
                      </Text>
                    ) : null}

                    {act.materials ? (
                      <View style={styles.materialsRow}>
                        <Text style={styles.materialsLabel}>Materials:</Text>
                        <Text style={styles.materialsValue}>{act.materials}</Text>
                      </View>
                    ) : null}
                  </Card>
                );
              })
            )}
          </View>
        )}

        {/* TAB 3: ASSESSMENTS */}
        {activeTab === 'assessments' && (
          <View>
            {assessments.length === 0 ? (
              <EmptyState title="No Assessments" message="No assessments recorded for this lesson." />
            ) : (
              assessments.map((asmt, idx) => {
                const asmtTrans = isTribalLanguage ? assessmentTranslations[asmt.id] : null;
                return (
                  <Card key={asmt.id || idx} style={styles.card}>
                    <View style={styles.actHeader}>
                      <View style={styles.seqBadge}>
                        <Text style={styles.seqText}>Check {asmt.sequence_order || idx + 1}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {asmtTrans && (
                          <Text style={styles.translatedTag}>[{selectedLanguage.toUpperCase()}]</Text>
                        )}
                        <Text style={styles.typeBadge}>{asmt.assessment_type.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.actTitle} testID={`assessment-title-${asmt.id}`}>
                      {asmtTrans?.translated_title || asmt.title}
                    </Text>
                    <Text style={styles.promptText} testID={`assessment-prompt-${asmt.id}`}>
                      💬 {asmtTrans?.translated_prompt || asmt.prompt}
                    </Text>

                    {(asmtTrans?.translated_expected_response || asmt.expected_response) ? (
                      <View style={styles.expectedRow}>
                        <Text style={styles.expectedLabel}>Expected Response:</Text>
                        <Text style={styles.expectedValue}>
                          {asmtTrans?.translated_expected_response || asmt.expected_response}
                        </Text>
                      </View>
                    ) : null}

                    <TouchableOpacity
                      style={styles.assessStudentBtn}
                      onPress={() =>
                        navigation.navigate('StudentRoster')
                      }
                    >
                      <Text style={styles.assessStudentText}>🎒 Assess Students on this Check ➔</Text>
                    </TouchableOpacity>
                  </Card>
                );
              })
            )}
          </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 18,
    marginBottom: 14,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  durationBadge: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  scriptText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  worksheetsBtn: {
    marginTop: 8,
  },
  actHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seqBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  seqText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  actTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  actInstructions: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  materialsRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
  },
  materialsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 6,
  },
  materialsValue: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  promptText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 6,
  },
  expectedRow: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  expectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  expectedValue: {
    fontSize: 13,
    color: '#15803D',
  },
  assessStudentBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    alignItems: 'center',
  },
  assessStudentText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 13,
  },
  // STAGE 2.12 MULTILINGUAL STYLES
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginRight: 8,
    textTransform: 'uppercase',
  },
  langPillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  langPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  langScriptTag: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 3,
    fontWeight: '500',
  },
  langScriptTagActive: {
    color: '#E0E7FF',
  },
  fallbackNoticeCard: {
    margin: 16,
    marginBottom: 0,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fallbackNoticeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  fallbackNoticeContent: {
    flex: 1,
  },
  fallbackNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  fallbackNoticeText: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  translatedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  translatedTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
});
