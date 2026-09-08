/**
 * PALASH Mobile Application Entry Point
 * Mother Tongue-Based Multilingual Education Platform
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { initializeDatabase } from './src/database';
import { authStore, useAuthStore } from './src/store/authStore';
import { syncStore } from './src/store/syncStore';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingIndicator, ErrorState } from './src/components';

export default function App() {
  const [appReady, setAppReady] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Dashboard'>('Login');

  const setupApp = async () => {
    try {
      setInitError(null);
      // 1. Initialize local SQLite database
      await initializeDatabase();

      // 2. Restore saved authentication session
      const hasAuth = await authStore.restoreAuth();
      setInitialRoute(hasAuth ? 'Dashboard' : 'Login');

      // 3. Initialize background sync listener
      await syncStore.init().catch(() => {});

      setAppReady(true);
    } catch (err) {
      setInitError((err as Error).message || 'Failed to initialize PALASH application.');
    }
  };

  useEffect(() => {
    setupApp();
  }, []);

  if (initError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState message={initError} onRetry={setupApp} />
      </SafeAreaView>
    );
  }

  if (!appReady) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator message="Initializing PALASH Offline Platform..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationProvider initialRouteName={initialRoute}>
        <AppNavigator />
      </NavigationProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
