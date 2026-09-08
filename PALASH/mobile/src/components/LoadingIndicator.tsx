/**
 * PALASH Loading and Empty State Components
 */

import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

export interface LoadingProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#4F46E5" />
      {message ? <Text style={styles.loadingText}>{message}</Text> : null}
    </View>
  );
};

export interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, action }) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
      {action ? <View style={styles.actionContainer}>{action}</View> : null}
    </View>
  );
};

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      {onRetry ? (
        <Text style={styles.retryText} onPress={onRetry}>
          Tap to retry
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4B5563',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
});
