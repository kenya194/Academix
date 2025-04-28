import 'react-native-gesture-handler';
import React, { useState } from 'react';
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
    coral: '#ff7f50',
    warmBeige:'#f5f5dc', 
    green:'#98fb98',
    softBlue:'#87cefa',
    lightYellow:'#fffacd', 
    lightTeal:'#afeeee',
  },
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true); 
  };
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
           <AppNavigator isLoggedIn={isLoggedIn} onLogin={handleLogin} />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;