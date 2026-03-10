import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme as NavLight, DarkTheme as NavDark } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider, useAppTheme } from './styles/ThemeContext';
import i18n from './localization/i18n';

/** Inner shell that reads the current theme from context */
function ThemedApp() {
  const { paperTheme, isDark, colors, loaded } = useAppTheme();

  // Build NavigationContainer theme from our design tokens
  const navTheme = isDark
    ? { ...NavDark, colors: { ...NavDark.colors, background: colors.background, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary } }
    : { ...NavLight, colors: { ...NavLight.colors, background: colors.background, card: colors.card, text: colors.text, border: colors.border, primary: colors.primary } };

  // Wait until the persisted theme preference has loaded
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer theme={navTheme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <AppNavigator />
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider initialMode="system">
            <ThemedApp />
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
