/**
 * PALASH Teacher Profile Screen
 * Displays and updates teacher details (name, phone, teaching languages).
 * Reads/writes offline via SQLite and syncs online with FastAPI /teachers/me.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { teacherRepository } from '../../database';
import { TeacherRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';
import { useSyncStore } from '../../store/syncStore';
import { defaultSyncQueue } from '../../sync/syncQueue';

export const TeacherProfileScreen: React.FC = () => {
  const { isOnline } = useSyncStore();
  const [teacher, setTeacher] = useState<TeacherRecord | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLang, setPreferredLang] = useState('hi');
  const [targetLang, setTargetLang] = useState('ho');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setStatusMsg('');

    try {
      if (isOnline) {
        try {
          const remoteData = await defaultApiClient.get<any>('/teachers/me');
          if (remoteData) {
            const record: TeacherRecord = {
              id: remoteData.id,
              user_id: remoteData.user_id || 1,
              school_id: remoteData.school_id,
              teacher_code: remoteData.teacher_code,
              full_name: remoteData.full_name,
              phone: remoteData.phone ?? null,
              preferred_language: remoteData.preferred_language || 'hi',
              target_language: remoteData.target_language || 'ho',
            };
            await teacherRepository.saveTeacher(record);
            setTeacher(record);
            setFullName(record.full_name);
            setPhone(record.phone || '');
            setPreferredLang(record.preferred_language);
            setTargetLang(record.target_language);
            setLoading(false);
            return;
          }
        } catch {
          // Fall back to local SQLite on network error
        }
      }

      // Offline read from SQLite
      const local = await teacherRepository.getTeacher();
      if (local) {
        setTeacher(local);
        setFullName(local.full_name);
        setPhone(local.phone || '');
        setPreferredLang(local.preferred_language);
        setTargetLang(local.target_language);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [isOnline]);

  const handleSave = async () => {
    if (!teacher) return;
    setSaving(true);
    setStatusMsg('');

    const updatedRecord: TeacherRecord = {
      ...teacher,
      full_name: fullName.trim() || teacher.full_name,
      phone: phone.trim() || null,
      preferred_language: preferredLang.trim().toLowerCase(),
      target_language: targetLang.trim().toLowerCase(),
    };

    try {
      // 1. Save to local SQLite
      await teacherRepository.saveTeacher(updatedRecord);
      setTeacher(updatedRecord);

      // 2. If online, update FastAPI
      if (isOnline) {
        await defaultApiClient.put('/teachers/me', {
          full_name: updatedRecord.full_name,
          phone: updatedRecord.phone,
          preferred_language: updatedRecord.preferred_language,
          target_language: updatedRecord.target_language,
          languages: [updatedRecord.preferred_language, updatedRecord.target_language],
        });
        setStatusMsg('Profile successfully updated!');
      } else {
        // Enqueue for offline sync
        await defaultSyncQueue.enqueue({
          entity_type: 'teacher',
          entity_id: updatedRecord.id,
          operation: 'UPDATE',
          payload: {
            full_name: updatedRecord.full_name,
            phone: updatedRecord.phone,
            preferred_language: updatedRecord.preferred_language,
            target_language: updatedRecord.target_language,
            languages: [updatedRecord.preferred_language, updatedRecord.target_language],
          },
        });
        setStatusMsg('Saved offline! Update queued for synchronization.');
      }
    } catch (err) {
      setStatusMsg(`Error updating profile: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="My Profile" />
        <LoadingIndicator message="Loading teacher profile..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Profile" />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        {statusMsg ? (
          <View testID="profile-status-banner" style={styles.statusBox}>
            <Text style={styles.statusBoxText}>{statusMsg}</Text>
          </View>
        ) : null}

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Teacher Identification</Text>

          <View style={styles.readOnlyRow}>
            <Text style={styles.readOnlyLabel}>Teacher Code</Text>
            <Text style={styles.readOnlyValue}>{teacher?.teacher_code || 'TCH-001'}</Text>
          </View>

          <View style={styles.readOnlyRow}>
            <Text style={styles.readOnlyLabel}>Assigned School ID</Text>
            <Text style={styles.readOnlyValue}>School #{teacher?.school_id || 'N/A'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Editable Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              testID="profile-name-input"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              testID="profile-phone-input"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. +91 9876543210"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Teaching Language</Text>
              <TextInput
                testID="profile-pref-lang"
                style={styles.input}
                value={preferredLang}
                onChangeText={setPreferredLang}
                placeholder="hi"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Target Language</Text>
              <TextInput
                testID="profile-target-lang"
                style={styles.input}
                value={targetLang}
                onChangeText={setTargetLang}
                placeholder="ho"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Button
            testID="profile-save-button"
            title="Save Profile"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />
        </Card>
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
  },
  card: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  readOnlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  readOnlyLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  readOnlyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    height: 46,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  saveButton: {
    marginTop: 12,
  },
  statusBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statusBoxText: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
    textAlign: 'center',
  },
});
