import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './screens/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';


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