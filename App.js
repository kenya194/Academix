import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, ActivityIndicator, View } from "react-native";
import AppNavigator from "./screens/AppNavigator";
import ErrorBoundary from "./components/ErrorBoundary";
import theme from "./theme";
import * as SecureStore from "expo-secure-store";
import LoginStack from "./screens/LoginStack";
import { AuthContext } from "./AuthContext";
import { LogBox } from "react-native";
export const navigationRef = React.createRef();

// Initialize logging (keep your existing logging setup)

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  // Consolidated auth check
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        setAuthToken(token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = useCallback(async (token) => {
    try {
      await SecureStore.setItemAsync("auth_token", token);
      console.log("Token stored successfully");

      // Use functional update to ensure state consistency
      setAuthToken(token);
      setIsLoggedIn((prev) => {
        console.log("Setting isLoggedIn to true");
        return true;
      });
    } catch (error) {
      console.error("Failed to save token:", error);
      Sentry.captureException(error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      // Add any other tokens you need to clear
      setIsLoggedIn(false);
      setAuthToken(null);

      // If you need to revoke tokens with a backend service:
      // await revokeToken(); // Make sure to implement this function

      Sentry.addBreadcrumb({
        category: "auth",
        message: "User logged out",
        level: "info",
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("User is logged in, should show AppNavigator");
    } else {
      console.log("User is not logged in, showing LoginStack");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("isLoggedIn changed to:", isLoggedIn);
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} theme={theme}>
          {" "}
          {/* Moved theme here */}
          <AuthContext.Provider
            value={{
              onLogin: handleLogin,
              onLogout: handleLogout,
              token: authToken,
              isLoggedIn, // Provide this for easier access
            }}
          >
            <StatusBar
              barStyle="dark-content"
              backgroundColor="#ffffff"
              animated
            />
            {!isLoggedIn ? (
              <LoginStack onLogin={handleLogin} />
            ) : (
              <AppNavigator onLogout={handleLogout} />
            )}
          </AuthContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
