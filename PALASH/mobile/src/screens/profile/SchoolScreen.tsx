/**
 * PALASH School Information Screen
 * Displays assigned school details. Works seamlessly offline with SQLite cache.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Header } from '../../components/Header';
import { OfflineBanner } from '../../components/OfflineBanner';
import { Card } from '../../components/Card';
import { LoadingIndicator, EmptyState } from '../../components/LoadingIndicator';
import { schoolRepository, teacherRepository } from '../../database';
import { SchoolRecord } from '../../database/types/database';
import { defaultApiClient } from '../../services/api';
import { useSyncStore } from '../../store/syncStore';

export const SchoolScreen: React.FC = () => {
  const { isOnline } = useSyncStore();
  const [school, setSchool] = useState<SchoolRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSchool = async () => {
    setLoading(true);
    try {
      const teacher = await teacherRepository.getTeacher();
      const schoolId = teacher?.school_id || 1;

      if (isOnline) {
        try {
          const remoteSchool = await defaultApiClient.get<any>(`/schools/${schoolId}`);
          if (remoteSchool) {
            const record: SchoolRecord = {
              id: remoteSchool.id,
              school_code: remoteSchool.school_code,
              name: remoteSchool.name,
              district: remoteSchool.district,
              block: remoteSchool.block ?? null,
              cluster: remoteSchool.cluster ?? null,
              village: remoteSchool.village ?? null,
              address: remoteSchool.address ?? null,
            };
            await schoolRepository.saveSchool(record);
            setSchool(record);
            setLoading(false);
            return;
          }
        } catch {
          // Fall back to local SQLite on error
        }
      }

      // Offline read
      const local = await schoolRepository.getSchool(schoolId);
      setSchool(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchool();
  }, [isOnline]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="My School" />
        <LoadingIndicator message="Loading school information..." />
      </View>
    );
  }

  if (!school) {
    return (
      <View style={styles.container}>
        <Header title="My School" />
        <EmptyState
          title="No School Assigned"
          message="No school profile found in local offline storage or server."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My School" />
      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.schoolIcon}>🏫</Text>
          <Text style={styles.schoolName}>{school.name}</Text>
          <Text style={styles.schoolCodeBadge}>CODE: {school.school_code}</Text>
        </View>

        <Card style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Administrative Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>District</Text>
            <Text style={styles.value}>{school.district}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Block</Text>
            <Text style={styles.value}>{school.block || 'Not specified'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Cluster</Text>
            <Text style={styles.value}>{school.cluster || 'Not specified'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Village</Text>
            <Text style={styles.value}>{school.village || 'Not specified'}</Text>
          </View>

          {school.address ? (
            <View style={styles.addressRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.addressValue}>{school.address}</Text>
            </View>
          ) : null}
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
  heroSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  schoolIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  schoolCodeBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailsCard: {
    padding: 20,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  addressRow: {
    paddingTop: 12,
  },
  addressValue: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
    lineHeight: 20,
  },
});
