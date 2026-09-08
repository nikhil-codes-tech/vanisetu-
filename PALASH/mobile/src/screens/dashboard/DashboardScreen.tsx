/**
 * PALASH Teacher Dashboard Screen
 * Central hub for teacher workflows, school context, curriculum access, and progress tracking.
 * Stage 2.11: Offline-First Progress Tracking & Classroom Analytics.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useSyncStore } from '../../store/syncStore';
import { useNavigation } from '../../navigation/NavigationContext';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import {
  teacherRepository,
  schoolRepository,
  curriculumRepository,
  worksheetRepository,
  dictionaryRepository,
  studentRepository,
  attendanceRepository,
} from '../../database';
import {
  TeacherRecord,
  SchoolRecord,
  EvaluationSummary,
  RecentEvaluationItem,
} from '../../database/types/database';

export const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isOnline, isSyncing, lastSyncTime, pendingUploadCount, triggerSync } = useSyncStore();
  const navigation = useNavigation();

  const todayStr = new Date().toISOString().split('T')[0];

  const [teacher, setTeacher] = useState<TeacherRecord | null>(null);
  const [school, setSchool] = useState<SchoolRecord | null>(null);
  const [classCount, setClassCount] = useState<number>(0);
  const [subjectCount, setSubjectCount] = useState<number>(0);
  const [lessonCount, setLessonCount] = useState<number>(0);
  const [dictCount, setDictCount] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [worksheetCount, setWorksheetCount] = useState<number>(0);
  const [attendanceSummary, setAttendanceSummary] = useState<{
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    rate: number;
  }>({ total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 0 });
  const [evaluationSummary, setEvaluationSummary] = useState<EvaluationSummary>({
    total: 0,
    completed: 0,
    averageScore: 0,
  });
  const [recentEvaluations, setRecentEvaluations] = useState<RecentEvaluationItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadLocalData = async () => {
    try {
      const localTeacher = await teacherRepository.getTeacher();
      setTeacher(localTeacher);

      const schoolId = localTeacher?.school_id;

      if (schoolId) {
        const localSchool = await schoolRepository.getSchool(schoolId);
        setSchool(localSchool);
      }

      // Parallel aggregate queries for high performance on low-cost devices
      const [
        classes,
        subCount,
        lesCount,
        wsCount,
        dCount,
        sCount,
        attSummary,
        evalSummary,
        recentEvals,
      ] = await Promise.all([
        curriculumRepository.getClasses(),
        curriculumRepository.countSubjects(),
        curriculumRepository.countLessons(),
        worksheetRepository.countWorksheets(),
        dictionaryRepository.count(),
        studentRepository.count(schoolId),
        attendanceRepository.getSummaryByDate(schoolId || 1, todayStr),
        studentRepository.getEvaluationSummary(schoolId),
        studentRepository.getRecentEvaluations(schoolId, 4),
      ]);

      setClassCount(classes.length);
      setSubjectCount(subCount);
      setLessonCount(lesCount);
      setWorksheetCount(wsCount);
      setDictCount(dCount);
      setStudentCount(sCount);

      const attTotal = attSummary.total;
      const attRate = attTotal > 0 ? Math.round((attSummary.present / attTotal) * 1000) / 10 : 0;
      setAttendanceSummary({
        ...attSummary,
        rate: attRate,
      });

      setEvaluationSummary(evalSummary);
      setRecentEvaluations(recentEvals);
    } catch (err) {
      // Safe non-blocking offline load error fallback
      console.warn('Dashboard local load warning:', err);
    }
  };

  useEffect(() => {
    loadLocalData();
  }, [lastSyncTime]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (isOnline) {
      await triggerSync().catch(() => {});
    }
    await loadLocalData();
    setRefreshing(false);
  };

  const formattedSyncTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never';

  return (
    <View style={styles.container}>
      <Header
        title="PALASH Dashboard"
        showBack={false}
        rightAction={
          <TouchableOpacity
            testID="dashboard-logout-button"
            style={styles.logoutButton}
            onPress={async () => {
              await logout();
              navigation.reset('Login');
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        }
      />
      <OfflineBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing || isSyncing} onRefresh={onRefresh} />
        }
      >
        {/* 1. Greeting Banner */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greetingText}>
            Johar, {teacher?.full_name || user?.username || 'Teacher'}! 👋
          </Text>
          <Text style={styles.schoolSubtext}>
            {school?.name ? `${school.name} (${school.district})` : 'Assigned Tribal Primary School'}
          </Text>
          <View style={styles.langPillContainer}>
            <Text style={styles.langPill}>
              Teaching: {teacher?.preferred_language?.toUpperCase() || 'HI'} ↔{' '}
              {teacher?.target_language?.toUpperCase() || 'HO'}
            </Text>
          </View>
        </View>

        {/* 2. Data Synchronization Status Card */}
        <Card style={styles.syncCard}>
          <View style={styles.syncCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.syncCardTitle}>Data Synchronization</Text>
              <Text style={styles.syncCardSubtitle}>
                Last synchronized: {formattedSyncTime} • {isOnline ? '🟢 Online' : '🟠 Offline Mode'}
              </Text>
              {pendingUploadCount > 0 && (
                <Text style={styles.pendingText}>
                  ⚠️ {pendingUploadCount} offline updates ready to upload
                </Text>
              )}
            </View>
            <TouchableOpacity
              testID="sync-action-button"
              style={[styles.syncActionButton, isSyncing && styles.syncButtonDisabled]}
              onPress={() => triggerSync()}
              disabled={isSyncing}
            >
              <Text style={styles.syncActionText}>
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 3. Progress Tracking & Analytics Section */}
        <Text style={styles.sectionHeader}>Classroom Progress Overview (कक्षा प्रगति)</Text>

        {/* A. Today's Attendance Progress Card */}
        <Card
          testID="dashboard-attendance-summary"
          style={styles.progressCard}
          onPress={() => navigation.navigate('Attendance')}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.progressCardTitle}>📋 Today's Roll-Call (दैनिक उपस्थिति)</Text>
            <Text style={styles.linkHint}>View ➔</Text>
          </View>
          <Text style={styles.progressCardSub}>
            Date: {todayStr} • {attendanceSummary.total > 0 ? `${attendanceSummary.total} recorded` : 'Not recorded yet'}
          </Text>

          <View style={styles.rateRow}>
            <Text style={styles.rateNumber}>{attendanceSummary.rate}%</Text>
            <Text style={styles.rateLabel}>Attendance Rate</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.max(0, attendanceSummary.rate))}%` },
              ]}
            />
          </View>

          {/* Roll-Call Count Badges */}
          <View style={styles.pillBadgeRow}>
            <View style={[styles.pillBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <Text style={[styles.pillBadgeText, { color: '#047857' }]}>
                Present: {attendanceSummary.present}
              </Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <Text style={[styles.pillBadgeText, { color: '#B91C1C' }]}>
                Absent: {attendanceSummary.absent}
              </Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <Text style={[styles.pillBadgeText, { color: '#B45309' }]}>
                Late: {attendanceSummary.late}
              </Text>
            </View>
            <View style={[styles.pillBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={[styles.pillBadgeText, { color: '#1D4ED8' }]}>
                Excused: {attendanceSummary.excused}
              </Text>
            </View>
          </View>
        </Card>

        {/* B. Student Assessments & Evaluation Summary */}
        <Card
          testID="dashboard-evaluation-summary"
          style={styles.progressCard}
          onPress={() => navigation.navigate('StudentRoster')}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.progressCardTitle}>🎯 Assessments & Grading (मूल्यांकन स्थिति)</Text>
            <Text style={styles.linkHint}>Roster ➔</Text>
          </View>
          <Text style={styles.progressCardSub}>
            Classroom evaluations linked to oral lessons and worksheets
          </Text>

          <View style={styles.evalMetricsRow}>
            <View style={styles.evalMetricBox}>
              <Text style={styles.evalMetricNumber}>{evaluationSummary.completed}</Text>
              <Text style={styles.evalMetricLabel}>Evaluations Completed</Text>
            </View>
            <View style={styles.evalMetricDivider} />
            <View style={styles.evalMetricBox}>
              <Text style={styles.evalMetricNumber}>
                {evaluationSummary.total > 0 ? `${evaluationSummary.averageScore}/10` : '—'}
              </Text>
              <Text style={styles.evalMetricLabel}>Average Score</Text>
            </View>
            <View style={styles.evalMetricDivider} />
            <View style={styles.evalMetricBox}>
              <Text style={styles.evalMetricNumber}>{studentCount}</Text>
              <Text style={styles.evalMetricLabel}>Total Students</Text>
            </View>
          </View>
        </Card>

        {/* C. Curriculum & Worksheets Readiness Card */}
        <Card
          testID="dashboard-curriculum-summary"
          style={styles.progressCard}
          onPress={() => navigation.navigate('Classes')}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.progressCardTitle}>📚 Curriculum & Resources (पाठ्यक्रम एवं सामग्री)</Text>
            <Text style={styles.linkHint}>Curriculum ➔</Text>
          </View>
          <Text style={styles.progressCardSub}>
            Available local offline teaching units and bilingual materials
          </Text>

          <View style={styles.resourceGrid}>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceCount}>{classCount}</Text>
              <Text style={styles.resourceLabel}>Grades / Classes</Text>
            </View>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceCount}>{subjectCount}</Text>
              <Text style={styles.resourceLabel}>Subjects</Text>
            </View>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceCount}>{lessonCount}</Text>
              <Text style={styles.resourceLabel}>Lessons Ready</Text>
            </View>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceCount}>{worksheetCount}</Text>
              <Text style={styles.resourceLabel}>Worksheets</Text>
            </View>
          </View>
        </Card>

        {/* 4. Recent Classroom Activity Feed */}
        <Card testID="dashboard-recent-activity" style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>🕒 Recent Classroom Activity (हालिया गतिविधि)</Text>
          {recentEvaluations.length === 0 ? (
            <Text style={styles.emptyNotice}>
              No recent student evaluations recorded. Conduct classroom assessments to view activity here.
            </Text>
          ) : (
            recentEvaluations.map((ev, idx) => (
              <View
                key={ev.id || idx}
                style={[
                  styles.recentActivityItem,
                  idx === recentEvaluations.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.activityIconCircle}>
                  <Text style={{ fontSize: 14 }}>⭐</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.activityStudentName}>
                    {ev.student_name || 'Enrolled Student'} {ev.student_code ? `(${ev.student_code})` : ''}
                  </Text>
                  <Text style={styles.activityRemarks}>
                    {ev.remarks || 'Classroom assessment evaluated'}
                  </Text>
                  <Text style={styles.activityTime}>
                    {ev.created_at ? new Date(ev.created_at).toLocaleDateString() : 'Today'}
                  </Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>
                    {ev.score} / {ev.max_score}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* 5. Navigation Grid */}
        <Text style={styles.sectionHeader}>Quick Actions</Text>

        <View style={styles.grid}>
          {/* Classes Navigation */}
          <Card
            testID="nav-card-classes"
            style={styles.gridCard}
            onPress={() => navigation.navigate('Classes')}
          >
            <Text style={styles.cardIcon}>📚</Text>
            <Text style={styles.cardNavTitle}>Classes</Text>
            <Text style={styles.cardNavSubtitle}>
              {classCount > 0 ? `${classCount} classes ready` : 'Curriculum units'}
            </Text>
          </Card>

          {/* Worksheets Navigation */}
          <Card
            testID="nav-card-worksheets"
            style={styles.gridCard}
            onPress={() => navigation.navigate('WorksheetList', { lessonId: 1 })}
          >
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardNavTitle}>Worksheets</Text>
            <Text style={styles.cardNavSubtitle}>
              {worksheetCount > 0 ? `${worksheetCount} available` : 'Bilingual exercises'}
            </Text>
          </Card>

          {/* Teacher Profile */}
          <Card
            testID="nav-card-profile"
            style={styles.gridCard}
            onPress={() => navigation.navigate('TeacherProfile')}
          >
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardNavTitle}>My Profile</Text>
            <Text style={styles.cardNavSubtitle}>Teacher details & languages</Text>
          </Card>

          {/* School Information */}
          <Card
            testID="nav-card-school"
            style={styles.gridCard}
            onPress={() => navigation.navigate('School')}
          >
            <Text style={styles.cardIcon}>🏫</Text>
            <Text style={styles.cardNavTitle}>My School</Text>
            <Text style={styles.cardNavSubtitle}>District, block & cluster</Text>
          </Card>

          {/* Bilingual Dictionary Navigation */}
          <Card
            testID="nav-card-dictionary"
            style={styles.gridCard}
            onPress={() => navigation.navigate('Dictionary')}
          >
            <Text style={styles.cardIcon}>📖</Text>
            <Text style={styles.cardNavTitle}>Word Bank (Ho/Hi)</Text>
            <Text style={styles.cardNavSubtitle}>
              {dictCount > 0 ? `${dictCount} words available` : 'Bilingual vocabulary'}
            </Text>
          </Card>

          {/* Student Roster Navigation */}
          <Card
            testID="nav-card-students"
            style={styles.gridCard}
            onPress={() => navigation.navigate('StudentRoster')}
          >
            <Text style={styles.cardIcon}>🎒</Text>
            <Text style={styles.cardNavTitle}>Student Roster</Text>
            <Text style={styles.cardNavSubtitle}>
              {studentCount > 0 ? `${studentCount} students enrolled` : 'Classroom records & grading'}
            </Text>
          </Card>

          {/* Create Worksheet Navigation */}
          <Card
            testID="nav-card-create-worksheet"
            style={styles.gridCard}
            onPress={() => navigation.navigate('CreateWorksheet', { lessonId: 1, lessonTitle: 'Class 1 Lesson' })}
          >
            <Text style={styles.cardIcon}>✍️</Text>
            <Text style={styles.cardNavTitle}>Create Worksheet</Text>
            <Text style={styles.cardNavSubtitle}>Author local offline exercise</Text>
          </Card>

          {/* Daily Attendance Navigation */}
          <Card
            testID="nav-card-attendance"
            style={styles.gridCard}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardNavTitle}>Daily Attendance</Text>
            <Text style={styles.cardNavSubtitle}>Roll-call & daily presence</Text>
          </Card>

          {/* Sync Center & Queue Diagnostics */}
          <Card
            testID="nav-card-sync-center"
            style={styles.gridCard}
            onPress={() => navigation.navigate('SyncCenter')}
          >
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardNavTitle}>Sync Center</Text>
            <Text style={styles.cardNavSubtitle}>Queue inspection & diagnostics</Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    marginRight: 6,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  welcomeSection: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  schoolSubtext: {
    fontSize: 14,
    color: '#C7D2FE',
    marginTop: 4,
  },
  langPillContainer: {
    marginTop: 12,
  },
  langPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  syncCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E7FF',
    padding: 14,
  },
  syncCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  syncCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  syncCardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  pendingText: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 4,
  },
  syncActionButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
    marginBottom: 12,
  },
  progressCard: {
    marginBottom: 14,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  linkHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  progressCardSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 10,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 6,
  },
  rateNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  rateLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  pillBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  evalMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  evalMetricBox: {
    flex: 1,
    alignItems: 'center',
  },
  evalMetricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  evalMetricLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  evalMetricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  resourceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 6,
  },
  resourceItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  resourceCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  resourceLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  emptyNotice: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  activityRemarks: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 1,
  },
  activityTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardNavTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardNavSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});

