/**
 * PALASH Mobile Worksheet Authoring Screen
 * Allows teachers in remote tribal classrooms to compose worksheets and questions
 * offline, saving locally and queuing for upstream sync.
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
import { worksheetRepository, worksheetQuestionRepository } from '../../database';
import { SyncQueueManager } from '../../sync/syncQueue';

export const CreateWorksheetScreen: React.FC = () => {
  const navigation = useNavigation();
  const params = navigation.currentRoute.params as { lessonId: number; lessonTitle: string } | undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [worksheetType, setWorksheetType] = useState('vocabulary');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState('A) सही, B) गलत');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [isSaved, setIsSaved] = useState(false);

  const lessonId = params?.lessonId || 1;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'कृपया कार्यपत्रक का शीर्षक दर्ज करें (Enter worksheet title).');
      return;
    }

    try {
      const wsId = Date.now(); // Deterministic local ID
      await worksheetRepository.saveWorksheet({
        id: wsId,
        lesson_id: lessonId,
        title: title.trim(),
        description: description.trim() || null,
        language_code: 'hi',
        source_language: 'hi',
        worksheet_type: worksheetType,
        difficulty_level: 'beginner',
        instructions: 'प्रश्नों के उत्तर दें।',
        content: null,
        answer_key: null,
        file_path: null,
        version: 1,
        is_active: 1,
      });

      if (questionText.trim()) {
        await worksheetQuestionRepository.saveQuestion({
          id: Date.now() + 1,
          worksheet_id: wsId,
          question_number: 1,
          question_text: questionText.trim(),
          question_type: 'multiple_choice',
          options: options.trim(),
          correct_answer: correctAnswer.trim(),
          marks: 1,
        });
      }

      // Enqueue to sync queue
      const queue = new SyncQueueManager();
      await queue.enqueue({
        entity_type: 'worksheet',
        entity_id: wsId,
        operation: 'CREATE',
        payload: {
          lesson_id: lessonId,
          title: title.trim(),
          description: description.trim() || null,
          worksheet_type: worksheetType,
          language_code: 'hi',
          source_language: 'hi',
        },
      });

      setIsSaved(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch {
      Alert.alert('Error', 'कार्यपत्रक सहेजने में विफल (Failed to save worksheet).');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="नया कार्यपत्रक बनाएं (Create Worksheet)"
        subtitle={params?.lessonTitle ? `पाठ: ${params.lessonTitle}` : 'Create Local Worksheet'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>कार्यपत्रक विवरण (Worksheet Details)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>शीर्षक (Title) *:</Text>
            <TextInput
              style={styles.input}
              placeholder="उदा. हो-हिन्दी शब्दावली अभ्यास"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              testID="ws-title-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>विवरण (Description):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={2}
              placeholder="इस कार्यपत्रक का उद्देश्य..."
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>प्रकार (Type):</Text>
            <View style={styles.tabRow}>
              {['vocabulary', 'reading', 'assessment'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeTab, worksheetType === t && styles.typeTabActive]}
                  onPress={() => setWorksheetType(t)}
                >
                  <Text style={[styles.typeText, worksheetType === t && styles.typeTextActive]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>प्रश्न #1 (Question 1)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>प्रश्न (Question Text):</Text>
            <TextInput
              style={styles.input}
              placeholder="उदा. 'दाः' का हिन्दी में क्या अर्थ है?"
              placeholderTextColor="#9ca3af"
              value={questionText}
              onChangeText={setQuestionText}
              testID="ws-q1-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>विकल्प (Options):</Text>
            <TextInput
              style={styles.input}
              placeholder="A) पानी, B) आग, C) हवा"
              placeholderTextColor="#9ca3af"
              value={options}
              onChangeText={setOptions}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>सही उत्तर (Correct Answer):</Text>
            <TextInput
              style={styles.input}
              placeholder="A"
              placeholderTextColor="#9ca3af"
              value={correctAnswer}
              onChangeText={setCorrectAnswer}
            />
          </View>

          {isSaved ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✓ कार्यपत्रक सफलतापूर्वक बनाया गया!</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>सहेजें (Save Worksheet)</Text>
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
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
    height: 44,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  typeTabActive: {
    backgroundColor: '#059669',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },
  typeTextActive: {
    color: '#ffffff',
  },
  saveBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
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
