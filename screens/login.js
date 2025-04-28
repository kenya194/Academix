import React, { useState } from 'react';
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

const Login = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      console.log("Passed Email")
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      console.log("Passed Password")
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async () => {
    const isValid = validateForm();

     // Even if the form is not valid, we proceed with login
  if (!isValid) {
    console.log("Validation failed but proceeding with login attempt");
  }

    setLoading(true);
    console.log("Loading Set")
    try {
          // Simulate API call (replace with actual API logic in real-world scenario)
    await new Promise((resolve, reject) => {
      const success = true;  // Set to false to simulate an error in the API
      if (success) {
        setTimeout(resolve, 1500);  // Simulate successful response after 1.5 seconds
      } else {
        setTimeout(() => reject(new Error('Simulated login error')), 1500);  // Simulate failure
      }
    });
      
      // On successful login, call the onLogin function passed from parent
      onLogin();  // This will update the isLoggedIn state in App.js

      // Navigate to Dashboard screen
      navigation.navigate('Dashboard');
    } catch (error) {
      // Only alert when an actual error is caught
      console.error('Login Error:', error);  // Log the error for debugging
  
      // Show alert to user for login failure (only happens if there's a genuine error)
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.subtitle}>Student Portal</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.warmBeige} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.warmBeige} />
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
                  color={theme.colors.warmBeige}  
                />
              </TouchableOpacity>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
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
    backgroundColor: '#f5f5f5',
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
    color: theme.colors.warmBeige ,
    marginTop: 5,
  },
  form: {
    backgroundColor: '#fff',
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
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
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
