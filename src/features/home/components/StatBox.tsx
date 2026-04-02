import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export const StatBox = ({ label, value, color, icon, isActive, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.statBox, isActive && { borderColor: color, borderWidth: 2, backgroundColor: '#FFF' }]} 
    onPress={onPress}
  >
    <View style={styles.statIconCircle}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  statBox: { width: (width - 55) / 2, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  statIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 10, color: '#616161', fontWeight: '700', textTransform: 'uppercase' },
});