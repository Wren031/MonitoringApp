import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

// OFFICIAL 7-ELEVEN BRAND PALETTE
const COLORS = {
  green: '#008163',   // Primary Green
  orange: '#F57E20',  // Secondary Orange
  red: '#EE2722',     // Accent Red
  dark: '#1C1C1E',    // Text/Button
  gray: '#8E8E93',    // Subtext
  lightGray: '#F2F2F7',
  white: '#FFFFFF',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth(); 

  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState({ 
    title: '', 
    message: '', 
    type: 'success' as 'success' | 'error' | 'warning' 
  });

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedRemember = await AsyncStorage.getItem('remember_me');
        if (savedRemember === 'true') {
          const savedEmail = await AsyncStorage.getItem('saved_email');
          const savedPassword = await AsyncStorage.getItem('saved_password');
          if (savedEmail) setEmail(savedEmail);
          if (savedPassword) setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (e) { /* Silent fail */ }
    };
    loadCredentials();
  }, []);

  const toggleRememberMe = async () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);
    if (!newValue) {
      setEmail('');
      setPassword('');
      await AsyncStorage.multiRemove(['saved_email', 'saved_password', 'remember_me']);
    }
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning') => {
    setToastConfig({ title, message, type });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Access Required", "Please enter your credentials.", "warning");
      return;
    }
    try {
      await login({ email, password });
      if (rememberMe) {
        await AsyncStorage.setItem('saved_email', email);
        await AsyncStorage.setItem('saved_password', password);
        await AsyncStorage.setItem('remember_me', 'true');
      }
      showToast("Verified", "Redirecting to store portal...", "success");
      setTimeout(() => router.replace('/(tabs)/home'), 1000);
    } catch (error: any) {
      showToast("Denial", "Invalid employee credentials.", "error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BRANDED TOP TOAST */}
      {toastVisible && (
        <View style={styles.toastWrapper}>
          <View style={styles.toastContainer}>
             <View style={styles.toastStripe}>
                <View style={[styles.s, {backgroundColor: COLORS.orange}]} />
                <View style={[styles.s, {backgroundColor: COLORS.green}]} />
                <View style={[styles.s, {backgroundColor: COLORS.red}]} />
             </View>
             <View style={styles.toastBody}>
                <Ionicons 
                  name={toastConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
                  size={20} color={toastConfig.type === 'success' ? COLORS.green : COLORS.red} 
                />
                <Text style={styles.toastText}>{toastConfig.message}</Text>
             </View>
          </View>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.brandStripe}>
            <View style={[styles.stripeItem, {backgroundColor: COLORS.orange}]} />
            <View style={[styles.stripeItem, {backgroundColor: COLORS.green}]} />
            <View style={[styles.stripeItem, {backgroundColor: COLORS.red}]} />
          </View>
          <Text style={styles.title}>Store Portal</Text>
          <Text style={styles.subtitle}>Log in to manage your 7-Eleven inventory</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee Email</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail}
                placeholder="id@7-eleven.com"
                placeholderTextColor={COLORS.gray}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.gray}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.checkbox} onPress={toggleRememberMe}>
              <Ionicons 
                name={rememberMe ? "checkbox" : "square-outline"} 
                size={22} color={rememberMe ? COLORS.green : COLORS.gray} 
              />
              <Text style={styles.checkboxLabel}>Remember my credentials</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && {opacity: 0.8}]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Secure Login</Text>}
          </TouchableOpacity>

          {/* SIGN UP NAVIGATION LINK */}
          <TouchableOpacity 
            style={styles.signUpLink} 
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signUpText}>
              New Employee? <Text style={styles.signUpHighlight}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PROPRIETARY SYSTEM • 2026</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  brandStripe: { flexDirection: 'row', width: 50, height: 6, marginBottom: 15, borderRadius: 3, overflow: 'hidden' },
  stripeItem: { flex: 1 },
  title: { fontSize: 30, fontWeight: '900', color: COLORS.dark, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 8, textAlign: 'center' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '800', color: COLORS.dark, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, 
    borderRadius: 14, paddingHorizontal: 16, height: 58, borderWidth: 1, borderColor: '#E5E5EA' 
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.dark },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { marginLeft: 10, fontSize: 14, color: COLORS.dark, fontWeight: '500' },
  loginBtn: { 
    backgroundColor: COLORS.dark, height: 62, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', marginTop: 35,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 3
  },
  loginBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '800' },
  
  // SIGN UP LINK STYLES
  signUpLink: { marginTop: 25, alignItems: 'center' },
  signUpText: { fontSize: 14, color: COLORS.gray, fontWeight: '500' },
  signUpHighlight: { color: COLORS.green, fontWeight: '800' },

  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  footerText: { fontSize: 11, color: COLORS.gray, fontWeight: '700', letterSpacing: 1 },
  
  toastWrapper: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 1000 },
  toastContainer: { backgroundColor: COLORS.white, borderRadius: 12, overflow: 'hidden', elevation: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12 },
  toastStripe: { flexDirection: 'row', height: 4 },
  s: { flex: 1 },
  toastBody: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  toastText: { marginLeft: 10, fontWeight: '600', color: COLORS.dark, fontSize: 13 }
});