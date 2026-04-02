import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Added for navigation
import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '../hooks/useInventory';

export default function NotificationScreen() {
  const router = useRouter();
  const { processedData } = useInventory();
  const alerts = processedData.notifications || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>RETAIL OPS</Text>
        </View>
        
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerCount}>{alerts.length} priority alerts</Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            
            <View style={styles.cardText}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={[styles.statusText, { color: item.color }]}>
                {item.alertType === 'EXPIRED' ? 'Item has expired' : 'Expiring very soon'}
              </Text>
              <Text style={styles.dateLabel}>Expiry: {item.expiry}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>All systems clear</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  backButton: { marginRight: 15, padding: 5 },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#616161', letterSpacing: 1.5 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#212121', marginLeft: 5 },
  headerCount: { fontSize: 13, color: '#008163', fontWeight: '700', marginTop: 2, marginLeft: 5 },
  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardText: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#212121' },
  statusText: { fontSize: 13, fontWeight: '600', marginVertical: 2 },
  dateLabel: { fontSize: 11, color: '#999', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#212121', marginTop: 15 },
});