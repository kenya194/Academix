import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './screens/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';

// Theme configuration
const theme = {
  dark: false,
  colors: {
    primary: '#4CAF50',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    border: '#e0e0e0',
    notification: '#ff3d00',
    error: '#f44336',
    success: '#4CAF50',
    warning: '#ff9800',
    info: '#2196f3',
  },
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <NavigationContainer>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#ffffff"
              animated={true}
            />
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}