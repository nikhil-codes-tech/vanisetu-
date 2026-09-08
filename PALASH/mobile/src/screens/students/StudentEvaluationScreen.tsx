/**
 * PALASH Student Assessment Evaluation Screen
 * Allows teachers to record scores and qualitative remarks offline for students.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '../../navigation/NavigationContext';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { studentRepository } from '../../database';
import { SyncQueueManager } from '../../sync/syncQueue';

export const StudentEvaluationScreen: React.FC = () => {
  const navigation = useNavigation();
  const params = navigation.currentRoute.params as {
    studentId?: number;
    studentName?: string;
    assessmentId?: number;
    worksheetId?: number;
    title?: string;
  } | undefined;

  const [score, setScore] = useState('8');
  const [maxScore, setMaxScore] = useState('10');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('completed');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!params?.studentId) {
      Alert.alert('Error', 'No student specified for evaluation.');
      return;
    }

    const parsedScore = parseFloat(score);
    const parsedMax = parseFloat(maxScore) || 10;

    if (isNaN(parsedScore) || parsedScore < 0) {
      Alert.alert('Error', 'Please enter a valid numeric score.');
      return;
    }

    try {
      const evalId = await studentRepository.saveEvaluation({
        student_id: params.studentId,
        assessment_id: params.assessmentId ?? null,
        worksheet_id: params.worksheetId ?? null,
        score: parsedScore,
        max_score: parsedMax,
        status,
        remarks: remarks.trim() || null,
      });

      // Queue mutation for online sync
      const syncQueue = new SyncQueueManager();
      await syncQueue.enqueue({
        entity_type: 'student_evaluation',
        entity_id: evalId,
        operation: 'CREATE',
        payload: {
          student_id: params.studentId,
          assessment_id: params.assessmentId,
          worksheet_id: params.worksheetId,
          score: parsedScore,
          max_score: parsedMax,
          status,
          remarks: remarks.trim() || null,
        },
      });

      setIsSaved(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err) {
      Alert.alert('Error', 'Failed to save evaluation locally.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={params?.title || 'मूल्यांकन दर्ज करें (Record Evaluation)'}
        subtitle={params?.studentName ? `विद्यार्थी: ${params.studentName}` : 'Student Evaluation'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>मूल्यांकन विवरण (Evaluation Details)</Text>

          {params?.studentName ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>विद्यार्थी का नाम:</Text>
              <Text style={styles.infoValue}>{params.studentName}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>प्राप्तांक (Score):</Text>
            <View style={styles.scoreRow}>
              <TextInput
                style={[styles.input, styles.scoreInput]}
                keyboardType="numeric"
                value={score}
                onChangeText={setScore}
                testID="eval-score-input"
              />
              <Text style={styles.slash}>/</Text>
              <TextInput
                style={[styles.input, styles.scoreInput]}
                keyboardType="numeric"
                value={maxScore}
                onChangeText={setMaxScore}
              />
              <Text style={styles.pointsLabel}>अंक (Points)</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>स्थिति (Status):</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[styles.statusTab, status === 'completed' && styles.statusTabActive]}
                onPress={() => setStatus('completed')}
              >
                <Text style={[styles.statusText, status === 'completed' && styles.statusTextActive]}>
                  पूर्ण (Completed)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusTab, status === 'needs_support' && styles.statusTabActive]}
                onPress={() => setStatus('needs_support')}
              >
                <Text style={[styles.statusText, status === 'needs_support' && styles.statusTextActive]}>
                  सहायता चाहिए (Needs Help)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>शिक्षक टिप्पणी (Teacher Remarks):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholder="विद्यार्थी की समझ और प्रदर्शन पर टिप्पणी लिखें..."
              placeholderTextColor="#9ca3af"
              value={remarks}
              onChangeText={setRemarks}
              testID="eval-remarks-input"
            />
          </View>

          {isSaved ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✓ मूल्यांकन सफलतापूर्वक सहेजा गया!</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>सहेजें (Save Evaluation)</Text>
            </TouchableOpacity>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
  },
  scoreInput: {
    width: 60,
    height: 44,
    textAlign: 'center',
    fontWeight: '700',
  },
  slash: {
    fontSize: 20,
    color: '#9ca3af',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  statusTabActive: {
    backgroundColor: '#059669',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  statusTextActive: {
    color: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  successBox: {
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  successText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
});
