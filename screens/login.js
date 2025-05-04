import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import theme from '../theme';

import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as Random from 'expo-random';

// Keycloak discovery configuration
const discovery = {
  authorizationEndpoint: 'https://keycloak.astromyllc.com/realms/ShootingStar/protocol/openid-connect/auth',
  tokenEndpoint: 'https://keycloak.astromyllc.com/realms/ShootingStar/protocol/openid-connect/token',
  revocationEndpoint: 'https://keycloak.astromyllc.com/realms/ShootingStar/protocol/openid-connect/revoke',
};

const clientId = 'mobileClient';
const redirectUri = makeRedirectUri({
  useProxy: true,  // Set to true for Expo Go or development environment
});

const Login = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // we won't use this for now
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'mobileClient',
      redirectUri: AuthSession.makeRedirectUri({
        native: 'academix://oauthredirect',
        useProxy: true // Auto-corrects URI format
      }),
      scopes: ['openid', 'profile', 'email'],
      responseType: 'code',
    },
    discovery
  );
  
  console.log("Using redirect URI:", 
    AuthSession.makeRedirectUri({
      native: 'academix://oauthredirect',
      useProxy: true
    })
  );
  console.log(AuthSession.makeRedirectUri({ native: 'academix://oauthredirect' }));

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization code received:', code);
      exchangeCodeForToken(code);
    }
  }, [response]);

  useEffect(() => {
    if (response?.type === 'error') {
      console.log('Full error details:', response.params);
    }
  }, [response]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'This field is required';
    }

    // Password input will exist but not used directly in Keycloak OAuth flow
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: 'mobileClient',
          code,
          redirect_uri: AuthSession.makeRedirectUri({ useProxy: true }),
          code_verifier: request.codeVerifier,
        }).toString(),
      });

      const data = await tokenResponse.json();

      if (data.access_token) {
        console.log('Access Token:', data.access_token);
        onLogin(data.access_token); // You can save it somewhere (SecureStore maybe)
        navigation.navigate('Dashboard');
      } else {
        console.error('Token Error:', data);
        Alert.alert('Login Failed', 'Unable to retrieve access token.');
      }
    } catch (error) {
      console.error('Token Exchange Error:', error);
      Alert.alert('Error', 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const isValid = validateForm();
    if (!isValid) {
      console.log('Validation failed.');
      return;
    }
    setLoading(true);
    console.log('Starting OAuth login with Keycloak...');
    promptAsync();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="school-outline" size={80} color={theme.colors.softBlue} />
            <Text style={styles.title}>Academix</Text>
            <Text style={styles.subtitle}>Parent Portal</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.coral} />
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: null });
                }}
                keyboardType="default"          // ✅ Now normal text
                autoCapitalize="sentences"      // ✅ Better for general text
                autoCorrect={true}              // ✅ Optional: autocorrect enabled for text
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.coral} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={theme.colors.coral}  
                />
              </TouchableOpacity>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

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
              onPress={() => Alert.alert('Forgot Password', 'Please contact your administrator')}
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 34,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: theme.colors.softBlue,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#5b8ef9',
    fontSize: 14,
  },
});

export default Login;
