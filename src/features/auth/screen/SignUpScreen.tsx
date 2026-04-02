import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

const COLORS = {
  green: '#008163',
  orange: '#F57E20',
  red: '#EE2722',
  dark: '#1C1C1E',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
  white: '#FFFFFF',
  border: '#E5E5EA',
};

export default function SignUpScreen() {
  const { signUp, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // GPS LOCATION LOGIC
  const fetchCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (reverseGeocode.length > 0) {
        const item = reverseGeocode[0];
        const readableAddress = `${item.name || ''} ${item.street || ''}, ${item.city}, ${item.region}`;
        setAddress(readableAddress.trim());
      }
    } catch (error) {
      showToast("Error fetching location");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !gender || !address) {
      showToast("Please fill in all fields.");
      return;
    }

    try {
      await signUp({ 
        email, 
        password, 
        full_name: fullName, 
        gender, 
        address,
        status: 'Active'
      });

      showToast("Account created successfully!");
      setTimeout(() => {
        router.replace('/login');
      }, 1500);

    } catch (error: any) {
      showToast(error.message || "Registration failed.");
      console.error("Sign up error:", error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* BRANDED TOAST */}
      {toastVisible && (
        <View style={styles.toastWrapper}>
          <View style={styles.toastContainer}>
            <View style={styles.toastStripe}>
              <View style={[styles.s, {backgroundColor: COLORS.orange}]} />
              <View style={[styles.s, {backgroundColor: COLORS.green}]} />
              <View style={[styles.s, {backgroundColor: COLORS.red}]} />
            </View>
            <View style={styles.toastBody}>
              <Ionicons name="information-circle" size={20} color={COLORS.dark} />
              <Text style={styles.toastText}>{toastMsg}</Text>
            </View>
          </View>
        </View>
      )}

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <View style={styles.brandStripe}>
              <View style={[styles.stripeItem, {backgroundColor: COLORS.orange}]} />
              <View style={[styles.stripeItem, {backgroundColor: COLORS.green}]} />
              <View style={[styles.stripeItem, {backgroundColor: COLORS.red}]} />
            </View>
            <Text style={styles.title}>Employee Registry</Text>
            <Text style={styles.subtitle}>Create your official store manager profile</Text>
          </View>

          <View style={styles.form}>
            <InputGroup label="Full Name *" icon="person-outline">
              <TextInput 
                style={styles.input} 
                value={fullName} 
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor={COLORS.gray}
              />
            </InputGroup>

            <InputGroup label="Official Email *" icon="mail-outline">
              <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail}
                placeholder="id@7-eleven.com"
                autoCapitalize="none"
                placeholderTextColor={COLORS.gray}
              />
            </InputGroup>

            <InputGroup label="Password *" icon="lock-closed-outline">
              <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                placeholderTextColor={COLORS.gray}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </InputGroup>

            {/* GENDER SELECTOR */}
            <InputGroup label="Gender" icon="transgender-outline">
                <TouchableOpacity 
                    style={styles.selectorTrigger} 
                    onPress={() => setShowGenderModal(true)}
                >
                    <Text style={[styles.input, { color: gender ? COLORS.dark : COLORS.gray }]}>
                        {gender || "Select Gender"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color={COLORS.gray} />
                </TouchableOpacity>
            </InputGroup>

            {/* ADDRESS WITH GPS */}
            <InputGroup label="Home Address" icon="location-outline">
              <TextInput 
                style={styles.input} 
                value={address} 
                onChangeText={setAddress}
                placeholder="Locating..."
                placeholderTextColor={COLORS.gray}
              />
              <TouchableOpacity onPress={fetchCurrentLocation} disabled={locationLoading}>
                {locationLoading ? (
                    <ActivityIndicator size="small" color={COLORS.green} />
                ) : (
                    <Ionicons name="locate" size={20} color={COLORS.green} />
                )}
              </TouchableOpacity>
            </InputGroup>

            <TouchableOpacity 
              style={[styles.signUpBtn, loading && {opacity: 0.8}]} 
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpBtnText}>Register Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>
                Already registered? <Text style={{color: COLORS.green, fontWeight: '900'}}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* GENDER SELECTION MODAL */}
      <Modal visible={showGenderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                {['Male', 'Female', 'Other'].map((item) => (
                    <TouchableOpacity 
                        key={item} 
                        style={styles.modalItem} 
                        onPress={() => { setGender(item); setShowGenderModal(false); }}
                    >
                        <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity 
                    style={[styles.modalItem, { borderBottomWidth: 0 }]} 
                    onPress={() => setShowGenderModal(false)}
                >
                    <Text style={[styles.modalItemText, { color: COLORS.red }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InputGroup({ label, icon, children }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox as any}>
        <Ionicons name={icon} size={20} color={COLORS.gray} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingHorizontal: 32, paddingBottom: 40, paddingTop: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 20, padding: 5 },
  brandStripe: { flexDirection: 'row', width: 50, height: 6, marginBottom: 15, borderRadius: 3, overflow: 'hidden' },
  stripeItem: { flex: 1 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.dark, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.gray, marginTop: 6, textAlign: 'center' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '800', color: COLORS.dark, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  inputBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, 
    borderRadius: 12, paddingHorizontal: 14, height: 54, borderWidth: 1, borderColor: COLORS.border 
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.dark },
  selectorTrigger: { flex: 1, flexDirection: 'row', alignItems: 'center', height: '100%' },
  signUpBtn: { 
    backgroundColor: COLORS.green, height: 60, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', marginTop: 20,
    shadowColor: COLORS.green, shadowOpacity: 0.2, shadowRadius: 10, elevation: 3
  },
  signUpBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  
  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: COLORS.dark, marginBottom: 20, textAlign: 'center' },
  modalItem: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, alignItems: 'center' },
  modalItemText: { fontSize: 16, fontWeight: '700', color: COLORS.dark },

  // TOAST
  toastWrapper: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 1000 },
  toastContainer: { backgroundColor: COLORS.white, borderRadius: 12, overflow: 'hidden', elevation: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12 },
  toastStripe: { flexDirection: 'row', height: 4 },
  s: { flex: 1 },
  toastBody: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  toastText: { marginLeft: 10, fontWeight: '600', color: COLORS.dark, fontSize: 13 }
});