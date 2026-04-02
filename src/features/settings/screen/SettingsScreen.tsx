import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this is installed
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/hooks/useAuth';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldVibrate: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const COLORS = {
  primary: '#008163',
  secondary: '#F48221',
  danger: '#EE2724',
  bg: '#F8F9FB',
  white: '#FFFFFF',
  textMain: '#222222',
  textSub: '#8E8E93',
  border: '#EEEEEE',
};

export default function SettingsScreen() {
  const { logout, loading, profile } = useAuth(); 
  
  // 1. State for the Toggle
  const [isAlertsEnabled, setIsAlertsEnabled] = useState(false);

  useEffect(() => {
    setupNotifications();
    loadSettings();
  }, []);

  // Load saved preference
  const loadSettings = async () => {
    const saved = await AsyncStorage.getItem('expiry_alerts_enabled');
    setIsAlertsEnabled(saved === 'true');
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('expiry-alerts', {
        name: 'Expiry Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    }
  };

  // 2. Function to toggle the alerts
  const toggleAlerts = async (value: boolean) => {
    setIsAlertsEnabled(value);
    await AsyncStorage.setItem('expiry_alerts_enabled', value.toString());
    
    if (value) {
      Vibration.vibrate(100);
      // Trigger a confirmation notification when turned ON
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Alerts Enabled",
          body: "You will now receive sound and vibration alerts for expiring items.",
          sound: true,
        },
        trigger: null,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerLabel}>RETAIL CONFIGURATION</Text>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.idBrandStripes}>
             <View style={[styles.stripe, { backgroundColor: COLORS.secondary }]} />
             <View style={[styles.stripe, { backgroundColor: COLORS.primary }]} />
             <View style={[styles.stripe, { backgroundColor: COLORS.danger }]} />
          </View>
          <View style={styles.profileInner}>
            <View style={styles.avatarIconContainer}><Ionicons name="person" size={32} color={COLORS.primary} /></View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profile?.full_name || 'User'}</Text>
              <Text style={styles.userRole}>{(profile?.status || 'Staff').toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Rules</Text>
          <View style={styles.group}>
            
            {/* 3. The Toggle Item */}
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <View style={[styles.iconBg, { backgroundColor: COLORS.primary + '10' }]}>
                  <Ionicons name="notifications" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.itemLabel}>Expiry Alerts</Text>
              </View>
              <Switch 
                trackColor={{ false: '#767577', true: COLORS.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isAlertsEnabled ? '#FFFFFF' : '#f4f3f4'}
                onValueChange={toggleAlerts}
                value={isAlertsEnabled}
              />
            </View>

            <SettingItem icon="warning" label="Low Stock Threshold" value="10 Units" color={COLORS.secondary} />
            <SettingItem icon="cloud-done" label="Auto-Sync Cloud" value="On" color="#4A90E2" isLast={true} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Preferences</Text>
          <View style={styles.group}>
            <SettingItem icon="moon" label="Dark Mode" value="Off" color="#5856D6" />
            <SettingItem icon="language" label="Language" value="English" color="#FF9500" />
            <SettingItem icon="finger-print" label="Biometric Login" value="Face ID" color={COLORS.primary} isLast={true} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.danger} /> : (
            <><Ionicons name="log-out" size={20} color={COLORS.danger} /><Text style={styles.logoutText}>Sign Out</Text></>
          )}
        </TouchableOpacity>

        <Text style={styles.version}>7-INV PRO v1.0.4 Build 2026</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({ icon, label, value, color, isLast }: any) {
  return (
    <TouchableOpacity style={[styles.item, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconBg, { backgroundColor: color + '10' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSub} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 25, paddingBottom: 15 },
  headerLabel: { fontSize: 11, fontWeight: '900', color: COLORS.primary, letterSpacing: 2 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.textMain },
  profileCard: { backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', marginBottom: 30, borderWidth: 1, borderColor: COLORS.border },
  idBrandStripes: { width: 8, height: '100%' },
  stripe: { flex: 1 },
  profileInner: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 },
  avatarIconContainer: { width: 60, height: 60, borderRadius: 12, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  profileInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
  userRole: { fontSize: 11, fontWeight: '900', color: COLORS.secondary, letterSpacing: 0.5, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: COLORS.textSub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5 },
  group: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textMain },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  itemValue: { fontSize: 14, color: COLORS.textSub, marginRight: 8, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, padding: 18, borderRadius: 16, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#FFDADA', marginTop: 10 },
  logoutText: { marginLeft: 10, color: COLORS.danger, fontWeight: '800', fontSize: 15 },
  version: { textAlign: 'center', color: COLORS.textSub, fontSize: 11, marginTop: 30, fontWeight: '700' },
});