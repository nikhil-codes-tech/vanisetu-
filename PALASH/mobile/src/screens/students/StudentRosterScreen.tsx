/**
 * PALASH Student Roster Screen
 * Displays enrolled students, class grouping, and quick navigation to record evaluations.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '../../navigation/NavigationContext';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { studentRepository, teacherRepository } from '../../database';
import { StudentRecord } from '../../database/types/database';

export const StudentRosterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState<number>(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const teacher = await teacherRepository.getTeacher();
      const sId = teacher?.school_id || 1;
      setSchoolId(sId);

      const list = await studentRepository.findBySchoolId(sId);
      if (list.length === 0) {
        // Fallback to all local students
        const all = await studentRepository.findAll();
        setStudents(all);
        setFilteredStudents(all);
      } else {
        setStudents(list);
        setFilteredStudents(list);
      }
    } catch {
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFilteredStudents(students);
    } else {
      const lower = text.toLowerCase();
      const filtered = students.filter(
        (s) =>
          s.full_name.toLowerCase().includes(lower) ||
          s.student_code.toLowerCase().includes(lower) ||
          (s.class_name && s.class_name.toLowerCase().includes(lower))
      );
      setFilteredStudents(filtered);
    }
  };

  const renderStudent = ({ item }: { item: StudentRecord }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.studentName}>{item.full_name}</Text>
          <Text style={styles.studentCode}>रोल / कोड: {item.student_code}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.class_name || 'Class 1'} {item.section ? `(${item.section})` : ''}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>मातृभाषा (Mother Tongue):</Text>
        <Text style={styles.metaValue}>{item.mother_tongue.toUpperCase()}</Text>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() =>
          navigation.navigate('StudentEvaluation', {
            studentId: item.id,
            studentName: item.full_name,
            title: 'मूल्यांकन दर्ज करें (Record Evaluation)',
          })
        }
      >
        <Text style={styles.actionButtonText}>मूल्यांकन दर्ज करें ➔</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="विद्यार्थी सूची (Student Roster)"
        subtitle="Classroom Student Records & Offline Grading"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <OfflineBanner />

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="विद्यार्थी खोजें (Search by name or code)..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.attendanceShortcutBtn}
          onPress={() => navigation.navigate('Attendance')}
          testID="btn-roster-attendance"
        >
          <Text style={styles.attendanceShortcutText}>📋 आज की उपस्थिति दर्ज करें (Daily Attendance) ➔</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>विद्यार्थी सूची लोड हो रही है...</Text>
        </View>
      ) : filteredStudents.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyTitle}>कोई विद्यार्थी नहीं मिला</Text>
          <Text style={styles.emptySubtitle}>No student records found in local database.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderStudent}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  studentCode: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#e0f2fe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369a1',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metaLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 6,
  },
  actionButton: {
    marginTop: 12,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  attendanceShortcutBtn: {
    marginTop: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  attendanceShortcutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
});
