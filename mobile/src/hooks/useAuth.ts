import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSigningIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithBiometric: () => Promise<void>;
  enableBiometric: (password: string) => Promise<void>;
  isBiometricAvailable: boolean;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  // Check biometric availability
  useEffect(() => {
    checkBiometricAvailability();
    bootstrapAsync();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const bootstrapAsync = async () => {
    try {
      // Restore token
      const token = await SecureStore.getItemAsync('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSigningIn(true);
    try {
      // Call API to authenticate
      const response = await fetch('https://api.example.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const { token, user } = data;

      // Store token securely
      await SecureStore.setItemAsync('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      setUser(user);
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setIsSigningIn(true);
    try {
      const response = await fetch('https://api.example.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      const { token, user } = data;

      await SecureStore.setItemAsync('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      setUser(user);
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const signInWithBiometric = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        reason: 'Autentique-se para acessar sua conta',
      });

      if (result.success) {
        // Get stored credentials
        const credentials = await SecureStore.getItemAsync('biometricCredentials');
        if (credentials) {
          const { email, password } = JSON.parse(credentials);
          await signIn(email, password);
        }
      }
    } catch (error) {
      console.error('Biometric sign in error:', error);
    }
  }, [signIn]);

  const enableBiometric = useCallback(async (password: string) => {
    try {
      const user = await AsyncStorage.getItem('userData');
      if (user) {
        const userData = JSON.parse(user);
        const credentials = {
          email: userData.email,
          password,
        };
        await SecureStore.setItemAsync(
          'biometricCredentials',
          JSON.stringify(credentials)
        );
      }
    } catch (error) {
      console.error('Enable biometric error:', error);
    }
  }, []);

  return {
    user,
    isLoading,
    isSigningIn,
    signIn,
    signUp,
    signOut,
    signInWithBiometric,
    enableBiometric,
    isBiometricAvailable,
  };
}
