import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from '@/i18n/I18nContext';
import { AppProvider, useAppState } from '@/state/AppContext';
import { AppThemeProvider } from '@/theme/ThemeContext';

function ThemedRootNavigator() {
  const { config, isDark, toggleDark } = useAppState();

  return (
    <AppThemeProvider configTheme={config?.theme} isDark={isDark} onToggleDark={toggleDark}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="doctor/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="prescription/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </AppThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <AppProvider>
            <ThemedRootNavigator />
          </AppProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
