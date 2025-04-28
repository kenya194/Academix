import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './login';
import Dashboard from './dashboard';
import Profile from './profilePage';
import Results from './resultsPage';
import Fees from './feeStatus';
import ErrorBoundary from '../components/ErrorBoundary';
import { View, Text, Button,Dimensions } from 'react-native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Get screen width for the drawer size
const screenWidth = Dimensions.get('window').width;

// Placeholder data for accounts
const accounts = [
  { id: '1', name: 'Account 1' },
  { id: '2', name: 'Account 2' },
  { id: '3', name: 'Account 3' },
];

// Drawer menu to navigate to account screens
const DrawerMenu = ({ navigation }) => {
  return (
    <View>
      {accounts.map(account => (
        <Button
          key={account.id}
          title={account.name}
          onPress={() => navigation.navigate('Account', { account: account })}
        />
      ))}
    </View>
  );
};

const AppNavigator = ({ isLoggedIn, onLogin }) => {
  return (
    <ErrorBoundary>
      <Stack.Navigator>
        {/* Login Screen */}
        {!isLoggedIn && (
          <Stack.Screen name="Login">
          {(props) => <Login {...props} onLogin={onLogin} />}
        </Stack.Screen>
        )}

        {/* After Login, Show the Drawer directly */}
        {isLoggedIn && (
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {() => (
              <Drawer.Navigator
                drawerContent={props => <DrawerMenu {...props} />}
                screenOptions={{
                  headerShown: true,
                  drawerStyle: {
                    width: screenWidth / 3,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 93,
                  },
                  contentContainerStyle: {
                    marginTop: 80, 
                  },
                  overlayColor: 'rgba(0, 0, 0, 0.06)', 
                  gestureEnabled: false, 
                  drawerType: 'slide'
                }}
                drawerType="slide"
              >
                <Drawer.Screen name="Dashboard" component={Dashboard} />
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="Results" component={Results} />
                <Drawer.Screen name="Fees" component={Fees} />
              </Drawer.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </ErrorBoundary>
  );
};

export default AppNavigator;