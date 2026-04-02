import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { HISTORY_DATA } from '@/src/data/inventoryData';
import { HistoryCard } from '../components/HistoryCard';
import { useHistoryFilter } from '../hooks/useHistoryFilter';
import { FilterType } from '../types/HistoryItem';

export default function HistoryScreen() {
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, filteredData } = useHistoryFilter(HISTORY_DATA);
  const filters: FilterType[] = ['All', 'Additions', 'Removals'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>RETAIL LOGS</Text>
        <Text style={styles.title}>Activity History</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.filterBtn, activeFilter === tab && styles.activeFilter]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterText, activeFilter === tab && styles.activeFilterText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { padding: 25, paddingBottom: 15 },
  headerLabel: { fontSize: 10, fontWeight: '800', color: '#008163', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '900', color: '#222' },
  searchSection: { paddingHorizontal: 25, marginBottom: 15 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, height: 45, borderRadius: 8, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 10 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 25, marginBottom: 20 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginRight: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' },
  activeFilter: { backgroundColor: '#008163', borderColor: '#008163' },
  filterText: { fontSize: 12, fontWeight: '700', color: '#888' },
  activeFilterText: { color: '#FFF' },
});