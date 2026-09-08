/**
 * PALASH Teacher Login Screen
 * Authenticates teacher credentials against FastAPI and transitions to Dashboard.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '../../navigation/NavigationContext';
import { Button } from '../../components/Button';
import { OfflineBanner } from '../../components/OfflineBanner';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { login, isLoading, error, clearError } = useAuthStore();
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLocalError('');
    clearError();

    if (!username.trim()) {
      setLocalError('Please enter your username');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password');
      return;
    }

    const success = await login(username.trim(), password);
    if (success) {
      navigation.reset('Dashboard');
    }
  };

  const displayedError = localError || error;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>PALASH</Text>
          <Text style={styles.appSubtitle}>
            Mother Tongue-Based Multilingual Education
          </Text>
          <Text style={styles.roleBadge}>TEACHER PORTAL</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>
            Enter your teacher credentials to access your offline lessons.
          </Text>

          {displayedError ? (
            <View testID="login-error-banner" style={styles.errorBanner}>
              <Text style={styles.errorText}>{displayedError}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              testID="login-username-input"
              style={styles.input}
              placeholder="e.g. teacher_ho_01"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setLocalError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              testID="login-password-input"
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setLocalError('');
              }}
              secureTextEntry
            />
          </View>

          <Button
            testID="login-submit-button"
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        <Text style={styles.footerNote}>
          PALASH works seamlessly offline. You can review cached lessons and worksheets without an active internet connection.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'center',
  },
  roleBadge: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
  },
  submitButton: {
    marginTop: 8,
  },
  footerNote: {
    marginTop: 24,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
