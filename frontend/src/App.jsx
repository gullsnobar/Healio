import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';

import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/common/ErrorBoundary';
import { theme } from './styles/theme';
import i18n from './localization/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <ErrorBoundary>
                <NavigationContainer>
                  <StatusBar style="light" />
                  <AppNavigator />
                </NavigationContainer>
              </ErrorBoundary>
            </SafeAreaProvider>
          </PaperProvider>
        </I18nextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
