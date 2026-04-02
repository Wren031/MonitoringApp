import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth/hooks/useAuth';
import { InventoryCard } from '../components/InventoryCard';
import { StatBox } from '../components/StatBox';
import { useInventory } from '../hooks/useInventory';

const BRAND = { GREEN: '#008163', ORANGE: '#F57E20', RED: '#EE2722', WHITE: '#FFFFFF', BG: '#F4F7F6', TEXT_DARK: '#212121', TEXT_MUTED: '#616161' };

export default function HomeScreen() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    filterType, 
    setFilterType, 
    processedData, 
    loading,
    categories,
    refresh,
    selectedCategoryId,
    setSelectedCategoryId
  } = useInventory();

  // Get the count from our hook logic
  const notiCount = processedData.notifications?.length || 0;

  useFocusEffect(
    React.useCallback(() => {
        refresh();
    }, [])  
  );

  const getFirstName = () => {
      const rawName = profile?.full_name;
      if (!rawName) return 'USER';
      return rawName.trim().split(' ')[0];
  };

  const firstName = getFirstName();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.brandHeader}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerLabel}>SYSTEM 7-OS</Text>
              <Text style={styles.headerTitle}>
                {authLoading ? 'Loading...' : `HELLO, ${firstName.toUpperCase()}`}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.notiButton} 
              onPress={() => router.push('/notification')} 
            >
              <Ionicons name="notifications-outline" size={24} color={BRAND.GREEN} />
              
              {/* Dynamic Badge: Only shows if there are alerts */}
              {notiCount > 0 && (
                <View style={styles.notiBadge}>
                  <Text style={styles.notiBadgeText}>
                    {notiCount > 9 ? '9+' : notiCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.stripeContainer}>
        <View style={[styles.stripe, { backgroundColor: BRAND.ORANGE }]} />
        <View style={[styles.stripe, { backgroundColor: BRAND.RED }]} />
        <View style={[styles.stripe, { backgroundColor: BRAND.GREEN }]} />
      </View>

      {/* ... keep Search and Stats sections exactly as they were ... */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={BRAND.TEXT_MUTED} />
          <TextInput 
            placeholder="Search SKUs..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding}>
        <View style={styles.statsGrid}>
          <StatBox label="Active" value={processedData.total} color={BRAND.TEXT_DARK} icon="cube-outline" isActive={filterType === 'ALL'} onPress={() => setFilterType('ALL')} />
          <StatBox label="Expired" value={processedData.expired.length} color={BRAND.RED} icon="alert-circle" isActive={filterType === 'EXPIRED'} onPress={() => setFilterType('EXPIRED')} />
          <StatBox label="Near Exp" value={processedData.priority.length} color={BRAND.ORANGE} icon="time-outline" isActive={filterType === 'PRIORITY'} onPress={() => setFilterType('PRIORITY')} />
          <StatBox label="Healthy" value={processedData.healthy.length} color={BRAND.GREEN} icon="checkmark-circle-outline" isActive={filterType === 'HEALTHY'} onPress={() => setFilterType('HEALTHY')} />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>DEPARTMENTS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            <TouchableOpacity 
              style={[styles.categoryPill, !selectedCategoryId && styles.activePill]} 
              onPress={() => setSelectedCategoryId(null)}
            >
              <Text style={[styles.categoryPillText, !selectedCategoryId && styles.activePillText]}>ALL</Text>
            </TouchableOpacity>

            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryPill, selectedCategoryId === cat.id && styles.activePill]} 
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text style={[styles.categoryPillText, selectedCategoryId === cat.id && styles.activePillText]}>
                  {cat.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {filterType === 'ALL' ? 'ALL INVENTORY' : `${filterType} ITEMS`}
          </Text>
        </View>

        {loading ? (
          <View style={{ marginTop: 40 }}>
            <ActivityIndicator size="large" color={BRAND.GREEN} />
          </View>
        ) : (
          processedData.displayList.map((item: any) => (
            <InventoryCard key={item.id} item={item} />
          ))
        )}

        {!loading && processedData.displayList.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color="#DDD" />
            <Text style={styles.emptyText}>No items found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.BG },
  brandHeader: { backgroundColor: BRAND.GREEN, paddingHorizontal: 20, paddingBottom: 45, paddingTop: 10 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLabel: { color: BRAND.WHITE, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, opacity: 0.9 },
  headerTitle: { color: BRAND.WHITE, fontSize: 18, fontWeight: '900', marginTop: 2 },
  
  notiButton: { backgroundColor: BRAND.WHITE, padding: 10, borderRadius: 12, position: 'relative' },
  // Updated notiBadge to contain text
  notiBadge: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    minWidth: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: BRAND.RED, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: BRAND.WHITE,
    paddingHorizontal: 4
  },
  notiBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center'
  },

  stripeContainer: { height: 9 },
  stripe: { height: 3 },
  searchWrapper: { paddingHorizontal: 20, marginTop: -28 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: BRAND.WHITE, borderRadius: 14, paddingHorizontal: 15, height: 56, elevation: 6 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: BRAND.TEXT_DARK, fontWeight: '500' },
  scrollPadding: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 40 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  categorySection: { marginBottom: 10 },
  categoryScroll: { paddingVertical: 10 },
  categoryPill: { backgroundColor: BRAND.WHITE, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#EEE' },
  activePill: { backgroundColor: BRAND.GREEN, borderColor: BRAND.GREEN },
  categoryPillText: { fontSize: 10, fontWeight: '800', color: BRAND.TEXT_DARK },
  activePillText: { color: BRAND.WHITE },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, color: BRAND.TEXT_MUTED },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { textAlign: 'center', marginTop: 10, color: BRAND.TEXT_MUTED, fontWeight: '600' }
});