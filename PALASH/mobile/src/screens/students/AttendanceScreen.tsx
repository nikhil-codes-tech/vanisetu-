/**
 * PALASH Daily Classroom Attendance Screen
 * Offline-first student roll-call and daily attendance tracking.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '../../navigation/NavigationContext';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { studentRepository, attendanceRepository, StudentRecord, StudentAttendanceRecord, AttendanceStatus } from '../../database';
import { SyncQueueManager } from '../../sync/syncQueue';
import { defaultSyncManager } from '../../sync/SyncManager';

export const AttendanceScreen: React.FC = () => {
  const navigation = useNavigation();
  const params = navigation.currentRoute.params as {
    schoolId?: number;
    className?: string;
    date?: string;
  } | undefined;

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(params?.date || todayStr);
  const [schoolId] = useState<number>(params?.schoolId || 1);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, { status: AttendanceStatus; remarks: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadClassroomRoster();
  }, [schoolId, selectedDate]);

  const loadClassroomRoster = async () => {
    try {
      setIsLoading(true);
      setSaveSuccess(false);

      // Load enrolled students
      let studentList = await studentRepository.findBySchoolId(schoolId, params?.className);
      if (studentList.length === 0) {
        studentList = await studentRepository.findAll();
      }
      setStudents(studentList);

      // Load existing attendance for selected date
      const existingAttendance = await attendanceRepository.findByDate(schoolId, selectedDate);
      const initialMap: Record<number, { status: AttendanceStatus; remarks: string }> = {};

      for (const s of studentList) {
        const found = existingAttendance.find((a) => a.student_id === s.id);
        initialMap[s.id] = {
          status: (found?.status as AttendanceStatus) || 'present',
          remarks: found?.remarks || '',
        };
      }

      setAttendanceMap(initialMap);
    } catch (err) {
      console.warn('Failed to load attendance roster:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
    setSaveSuccess(false);
  };

  const handleRemarkChange = (studentId: number, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<number, { status: AttendanceStatus; remarks: string }> = {};
    for (const s of students) {
      updated[s.id] = {
        status,
        remarks: attendanceMap[s.id]?.remarks || '',
      };
    }
    setAttendanceMap(updated);
    setSaveSuccess(false);
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      Alert.alert('Notice', 'No students to record attendance for.');
      return;
    }

    try {
      setIsSaving(true);

      const recordsToSave: StudentAttendanceRecord[] = students.map((s) => ({
        student_id: s.id,
        school_id: s.school_id || schoolId,
        attendance_date: selectedDate,
        status: attendanceMap[s.id]?.status || 'present',
        remarks: attendanceMap[s.id]?.remarks ? attendanceMap[s.id].remarks.trim() : null,
      }));

      // 1. Save directly to local SQLite
      await attendanceRepository.recordBulkAttendance(recordsToSave);

      // 2. Queue mutation for online sync
      const syncQueue = new SyncQueueManager();
      await syncQueue.enqueue({
        entity_type: 'student_attendance',
        entity_id: recordsToSave[0]?.student_id || 1,
        operation: 'CREATE',
        payload: {
          school_id: schoolId,
          attendance_date: selectedDate,
          records: recordsToSave.map((r) => ({
            student_id: r.student_id,
            status: r.status,
            remarks: r.remarks,
          })),
        },
      });

      // 3. Trigger sync attempt in background if connected
      defaultSyncManager.sync().catch(() => {});

      setSaveSuccess(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to save attendance locally.');
    } finally {
      setIsSaving(false);
    }
  };

  // Compute stats
  const total = students.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  for (const s of students) {
    const status = attendanceMap[s.id]?.status;
    if (status === 'present') presentCount++;
    else if (status === 'absent') absentCount++;
    else if (status === 'late') lateCount++;
    else if (status === 'excused') excusedCount++;
  }

  return (
    <View style={styles.container}>
      <Header
        title="दैनिक उपस्थिति (Daily Attendance)"
        subtitle={`दिनांक: ${selectedDate} • कुल: ${total}`}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Date Selector & Bulk Actions Bar */}
        <Card style={styles.controlCard}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>दिनांक (Date):</Text>
            <TextInput
              style={styles.dateInput}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="YYYY-MM-DD"
              testID="attendance-date-input"
            />
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => markAll('present')}
              testID="btn-mark-all-present"
            >
              <Text style={styles.quickActionText}>✓ सभी उपस्थित (All Present)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionBtn, styles.quickActionBtnAlt]}
              onPress={() => markAll('absent')}
            >
              <Text style={[styles.quickActionText, styles.quickActionTextAlt]}>✗ सभी अनुपस्थित (All Absent)</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Summary Metrics */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryItem, { borderLeftColor: '#10b981' }]}>
            <Text style={styles.summaryCount}>{presentCount}</Text>
            <Text style={styles.summaryLabel}>उपस्थित (Present)</Text>
          </View>
          <View style={[styles.summaryItem, { borderLeftColor: '#ef4444' }]}>
            <Text style={styles.summaryCount}>{absentCount}</Text>
            <Text style={styles.summaryLabel}>अनुपस्थित (Absent)</Text>
          </View>
          <View style={[styles.summaryItem, { borderLeftColor: '#f59e0b' }]}>
            <Text style={styles.summaryCount}>{lateCount}</Text>
            <Text style={styles.summaryLabel}>विलंब (Late)</Text>
          </View>
          <View style={[styles.summaryItem, { borderLeftColor: '#6366f1' }]}>
            <Text style={styles.summaryCount}>{excusedCount}</Text>
            <Text style={styles.summaryLabel}>अवकाश (Excused)</Text>
          </View>
        </View>

        {saveSuccess ? (
          <View style={styles.successBanner} testID="attendance-success-banner">
            <Text style={styles.successText}>✓ उपस्थिति ऑफ़लाइन सहेजी गई! (Saved to SQLite)</Text>
          </View>
        ) : null}

        {/* Student Roll-Call List */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#4f46e5" style={{ marginVertical: 30 }} />
        ) : students.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>कोई विद्यार्थी नहीं मिला (No Students)</Text>
            <Text style={styles.emptySubtitle}>विद्यार्थी नामावली में कोई रिकॉर्ड मौजूद नहीं है।</Text>
          </Card>
        ) : (
          students.map((student, idx) => {
            const currentStatus = attendanceMap[student.id]?.status || 'present';
            const remarks = attendanceMap[student.id]?.remarks || '';

            return (
              <Card key={student.id} style={styles.studentCard}>
                <View style={styles.studentHeader}>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentAvatarText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.full_name}</Text>
                    <Text style={styles.studentMeta}>
                      {student.student_code} {student.class_name ? `• कक्षा: ${student.class_name}` : ''}
                    </Text>
                  </View>
                </View>

                {/* Status selector buttons */}
                <View style={styles.statusButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusPill,
                      currentStatus === 'present' && styles.statusPillPresent,
                    ]}
                    onPress={() => handleStatusChange(student.id, 'present')}
                    testID={`status-present-${student.id}`}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        currentStatus === 'present' && styles.statusPillTextActive,
                      ]}
                    >
                      P • उपस्थित
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusPill,
                      currentStatus === 'absent' && styles.statusPillAbsent,
                    ]}
                    onPress={() => handleStatusChange(student.id, 'absent')}
                    testID={`status-absent-${student.id}`}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        currentStatus === 'absent' && styles.statusPillTextActive,
                      ]}
                    >
                      A • अनुपस्थित
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusPill,
                      currentStatus === 'late' && styles.statusPillLate,
                    ]}
                    onPress={() => handleStatusChange(student.id, 'late')}
                    testID={`status-late-${student.id}`}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        currentStatus === 'late' && styles.statusPillTextActive,
                      ]}
                    >
                      L • विलंब
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusPill,
                      currentStatus === 'excused' && styles.statusPillExcused,
                    ]}
                    onPress={() => handleStatusChange(student.id, 'excused')}
                    testID={`status-excused-${student.id}`}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        currentStatus === 'excused' && styles.statusPillTextActive,
                      ]}
                    >
                      E • अवकाश
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Optional remarks */}
                <TextInput
                  style={styles.remarkInput}
                  placeholder="टिप्पणी जोड़ें (वैकल्पिक)..."
                  placeholderTextColor="#9ca3af"
                  value={remarks}
                  onChangeText={(txt) => handleRemarkChange(student.id, txt)}
                />
              </Card>
            );
          })
        )}

        {/* Save Attendance Button */}
        {students.length > 0 && (
          <View style={styles.actionContainer}>
            <Button
              title={isSaving ? 'सहेजा जा रहा है...' : 'उपस्थिति सहेजें (Save Attendance)'}
              onPress={handleSaveAttendance}
              disabled={isSaving}
              style={{ backgroundColor: '#4f46e5' }}
            />
          </View>
        )}
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
  controlCard: {
    padding: 14,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: '#111827',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  quickActionBtnAlt: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  quickActionTextAlt: {
    color: '#dc2626',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  summaryItem: {
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
  summaryCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '500',
  },
  successBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  successText: {
    color: '#065f46',
    fontWeight: '700',
    fontSize: 14,
  },
  studentCard: {
    padding: 12,
    marginBottom: 10,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338ca',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  studentMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  statusPill: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statusPillPresent: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  statusPillAbsent: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
  },
  statusPillLate: {
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
  },
  statusPillExcused: {
    backgroundColor: '#6366f1',
    borderColor: '#4f46e5',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4b5563',
  },
  statusPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  remarkInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: '#374151',
  },
  actionContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
});
