// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import Dashboard from './dashboard';
import Profile from './profilePage';
import Results from './resultsPage';
import Fees from './feeStatus';
import ErrorBoundary from '../components/ErrorBoundary';

const Stack = createStackNavigator();

// Common header options for all screens
const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: '#2196F3',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerBackTitleVisible: false,
};

const AppNavigator = () => {
  return (
    <ErrorBoundary>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={commonHeaderOptions}
      >
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ 
            headerShown: false,
            gestureEnabled: false // Prevent back gesture on login screen
          }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
          options={{
            title: 'Home',
            headerLeft: null // Prevent going back to login
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile}
          options={{
            title: 'My Profile'
          }}
        />
        <Stack.Screen 
          name="Results" 
          component={Results}
          options={{
            title: 'Academic Results'
          }}
        />
        <Stack.Screen 
          name="Fees" 
          component={Fees}
          options={{
            title: 'Fee Status'
          }}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};

export default AppNavigator;