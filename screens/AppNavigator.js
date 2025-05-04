import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import Login from "./login";
import Dashboard from "./dashboard";
import Profile from "./profilePage";
import Results from "./resultsPage";
import Fees from "./feeStatus";
import StudentAccountList from "./StudentAccountList";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const screenWidth = Dimensions.get("window").width;

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Academix Portal</Text>
      </View>
      <DrawerItemList {...props} />

      {/* Additional drawer items if needed */}
      <View style={styles.drawerFooter}>
        <Text style={styles.drawerFooterText}>v1.0.0</Text>
      </View>
    </View>
  );
};

const AppNavigator = ({ isLoggedIn, onLogin }) => {
  return (
    <ErrorBoundary>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => <Login {...props} onLogin={onLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {() => (
              <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                  headerShown: true,
                  drawerStyle: {
                    width: screenWidth * 0.7,
                    backgroundColor: "#fff",
                  },
                  overlayColor: "rgba(0, 0, 0, 0.2)",
                  gestureEnabled: true,
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => props.navigation.toggleDrawer()}
                      style={{ marginLeft: 15 }}
                    >
                      <Ionicons name="menu" size={28} color="#4CAF50" />
                    </TouchableOpacity>
                  ),
                }}
              >
                <Drawer.Screen
                  name="Students"
                  component={StudentAccountList}
                  options={{
                    title: "Student Dashboard",
                    drawerIcon: ({ color }) => (
                      <Ionicons name="people" size={24} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Dashboard"
                  component={Dashboard}
                  options={{
                    drawerIcon: ({ color }) => (
                      <Ionicons name="home" size={24} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    drawerIcon: ({ color }) => (
                      <Ionicons name="person" size={24} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Results"
                  component={Results}
                  options={{
                    drawerIcon: ({ color }) => (
                      <Ionicons name="document-text" size={24} color={color} />
                    ),
                  }}
                />
                <Drawer.Screen
                  name="Fees"
                  component={Fees}
                  options={{
                    drawerIcon: ({ color }) => (
                      <Ionicons name="wallet" size={24} color={color} />
                    ),
                  }}
                />
              </Drawer.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 40,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: "auto",
  },
  drawerFooterText: {
    fontSize: 12,
    color: "#888",
  },
});

export default AppNavigator;
