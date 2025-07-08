import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import theme from "../theme";
import { AuthContext } from "../AuthContext";

// Keycloak configuration
const keycloakConfig = {
  issuer: "https://keycloak.astromyllc.com/realms/ShootingStar",
  clientId: "mobileClient",
  scopes: ["openid", "profile", "email"],
};

const discovery = {
  authorizationEndpoint: `${keycloakConfig.issuer}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakConfig.issuer}/protocol/openid-connect/token`,
  revocationEndpoint: `${keycloakConfig.issuer}/protocol/openid-connect/revoke`,
};

const Login = ({ navigation }) => {
  const { onLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectUri = makeRedirectUri({
    native: "academix://oauthredirect",
    useProxy: __DEV__, // Only use proxy in development
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: keycloakConfig.clientId,
      redirectUri,
      scopes: keycloakConfig.scopes,
      responseType: "code",
    },
    discovery
  );

  // Debug redirect URI
  useEffect(() => {
    console.log("Calculated Redirect URI:", redirectUri);
  }, []);

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log("Authorization code received, exchanging for token...");
      exchangeCodeForToken(code);
    } else if (response?.type === "error") {
      console.error("OAuth Error:", response.error);
      Alert.alert(
        "Login Error",
        response.error_description || "Authentication failed"
      );
      setLoading(false);
    }
  }, [response]);

  const exchangeCodeForToken = async (code) => {
  try {
    console.log("Starting token exchange...");

    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", keycloakConfig.clientId);
    formData.append("code", code);
    formData.append("redirect_uri", redirectUri);
    formData.append("code_verifier", request?.codeVerifier || "");

    const tokenResponse = await fetch(discovery.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      throw new Error(errorData.error_description || "Token exchange failed");
    }

    const data = await tokenResponse.json();

    // ✅ Save tokens
    await SecureStore.setItemAsync("auth_token", data.access_token);
    await SecureStore.setItemAsync("refresh_token", data.refresh_token);

    // ✅ Save Set-Cookie header if available
    const setCookieHeader = tokenResponse.headers.get("set-cookie");
      console.log("Checking Existence of Cookies:", setCookieHeader);
    if (setCookieHeader) {
      console.log("Saving cookie:", setCookieHeader);
      await SecureStore.setItemAsync("session_cookie", setCookieHeader);
    }

    console.log("Login successful, navigating...");
    setLoading(false);
    onLogin(data.access_token);

  } catch (error) {
    console.error("Full token exchange error:", error);
    Alert.alert("Login Failed", error.message);
    setLoading(false);
  }
};

  const handleLogin = () => {
    setLoading(true);
    promptAsync().catch((error) => {
      console.error("Prompt Error:", error);
      setLoading(false);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons
              name="school-outline"
              size={80}
              color={theme.colors.softBlue}
            />
            <Text style={styles.title}>Academix</Text>
            <Text style={styles.subtitle}>Parent Portal</Text>
          </View>

          <View style={styles.form}>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading || !request}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() =>
                Alert.alert(
                  "Forgot Password",
                  "Please contact your administrator"
                )
              }
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.coral,
    marginTop: 5,
  },
  form: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 34,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: theme.colors.softBlue,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#5b8ef9",
    fontSize: 14,
  },
});

export default Login;
