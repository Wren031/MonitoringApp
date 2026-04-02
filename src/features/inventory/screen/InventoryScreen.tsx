import { COLORS } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from 'expo-router';
import { InventoryCard } from '../components/InventoryCard';
import { ProductModal } from '../components/ProductModal';
import { useInventory } from '../hooks/useInventory';
import { Product } from '../types/InventoryTypes';

type ExpiryFilter = 'ALL' | 'EXPIRED' | 'SOON_10' | 'FUTURE_30';

export default function InventoryScreen() {
  const { 
    inventory = [], 
    categories = [], 
    refresh,
    loading, 
    showHidden, 
    setShowHidden, 
    saveProduct, 
    deleteProduct 
  } = useInventory();

  useFocusEffect(
    React.useCallback(() => {
        refresh();
    }, [])
  )

  const [activeExpiryFilter, setActiveExpiryFilter] = useState<ExpiryFilter>('ALL');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Product>({
    id: '', 
    name: '', 
    category: { id: '', name: '' },
    expiry: '', 
    isHidden: false 
  });

  useEffect(() => {
    if (!loading && categories.length > 0 && !form.category?.id) {
      setForm(prev => ({
        ...prev,
        category: categories[0]
      }));
    }
  }, [categories, loading]); 

  // --- Helpers ---
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const months: { [key: string]: number } = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };
    const parts = dateStr.replace(',', '').split(' ');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), months[parts[0].toLowerCase()], parseInt(parts[1]));
    }
    return new Date(dateStr);
  };

  const getRemainingDays = (expiryStr: string) => {
    if (!expiryStr) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = parseDate(expiryStr);
    expiryDate.setHours(0, 0, 0, 0);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const { badgeCounts, filteredData } = useMemo(() => {
    const mergedList = inventory.map(item => {
      const catId = (item as any).category_id || item.category?.id;
      const catObj = categories.find(c => c.id === catId);
      return {
        ...item,
        category: catObj || { id: '', name: 'Uncategorized' }
      };
    });

    const activeItems = mergedList.filter(i => !i.isHidden);
    const counts = {
      expired: activeItems.filter(i => getRemainingDays(i.expiry) <= 0).length,
      soon10: activeItems.filter(i => {
        const days = getRemainingDays(i.expiry);
        return days > 0 && days <= 10;
      }).length,
      future30: activeItems.filter(i => getRemainingDays(i.expiry) > 30).length
    };

    let data = mergedList.filter(item => !!item && item.isHidden === showHidden);

    if (activeExpiryFilter === 'EXPIRED') {
      data = data.filter(i => getRemainingDays(i.expiry) <= 0);
    } else if (activeExpiryFilter === 'SOON_10') {
      data = data.filter(i => {
        const days = getRemainingDays(i.expiry);
        return days > 0 && days <= 10;
      });
    } else if (activeExpiryFilter === 'FUTURE_30') {
      data = data.filter(i => getRemainingDays(i.expiry) > 30);
    }

    data.sort((a, b) => parseDate(a.expiry).getTime() - parseDate(b.expiry).getTime());

    return { badgeCounts: counts, filteredData: data };
  }, [inventory, categories, showHidden, activeExpiryFilter]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ 
      id: '', 
      name: '', 
      category: categories[0] || { id: '', name: 'Select Category' }, 
      expiry: '', 
      isHidden: false 
    });
    setIsModalVisible(true);
  };

  const handleOpenEdit = (item: Product) => {
    setEditingId(item.id);
    setForm(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.expiry) return Alert.alert("Required", "Fill all details.");
    const success = await saveProduct(form, editingId);
    if (success) setIsModalVisible(false);
    refresh();
    closeModal();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Remove this item permanently?", [
      { text: "Cancel", style: 'cancel' },
      { text: "Delete", style: 'destructive', onPress: () => deleteProduct(id) }
    ]);

  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>RETAIL OPS</Text>
          <Text style={styles.headerTitle}>Inventory</Text>
        </View>
        <TouchableOpacity style={styles.fab} onPress={handleOpenAdd}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <>
          <View style={styles.filterBar}>
            <TouchableOpacity 
              style={[styles.filterBtn, !showHidden && styles.filterBtnActive]} 
              onPress={() => setShowHidden(false)}
            >
              <Text style={[styles.filterText, !showHidden && styles.filterTextActive]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterBtn, showHidden && styles.filterBtnActive]} 
              onPress={() => setShowHidden(true)}
            >
              <Text style={[styles.filterText, showHidden && styles.filterTextActive]}>Hidden</Text>
            </TouchableOpacity>
          </View>

          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.expiryTabs}>
              <ExpiryTab label="All" active={activeExpiryFilter === 'ALL'} onPress={() => setActiveExpiryFilter('ALL')} />
              <ExpiryTab label="Expired" count={badgeCounts.expired} active={activeExpiryFilter === 'EXPIRED'} onPress={() => setActiveExpiryFilter('EXPIRED')} badgeColor="#EE2724" />
              <ExpiryTab label="Soon (10d)" count={badgeCounts.soon10} active={activeExpiryFilter === 'SOON_10'} onPress={() => setActiveExpiryFilter('SOON_10')} badgeColor="#F48221" />
              <ExpiryTab label="Future (30d+)" count={badgeCounts.future30} active={activeExpiryFilter === 'FUTURE_30'} onPress={() => setActiveExpiryFilter('FUTURE_30')} badgeColor="#008163" />
            </ScrollView>
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (

          <InventoryCard 
            item={item} 
            onPress={handleOpenEdit} 
            onHide={async () => {
              // Toggle the hidden status
              const newStatus = !item.isHidden;
              const success = await saveProduct({ ...item, isHidden: newStatus }, item.id);
              if (success ) {
                refresh(); // Force refresh to move the item between lists
              }
            }} 
            onDelete={() => handleDelete(item.id)} 
          />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="barcode-outline" size={40} color="#DDD" />
                <Text style={styles.emptyText}>No matching inventory found.</Text>
              </View>
            }
          />
        </>
      )}

      <ProductModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onSave={handleSave} 
        form={form} 
        setForm={setForm} 
        categories={categories} 
        editingId={editingId} 
      />
    </SafeAreaView>
  );
}

const ExpiryTab = ({ label, active, onPress, count, badgeColor }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.expiryTab, active && styles.expiryTabActive]}>
    <View style={styles.tabContent}>
      <Text style={[styles.expiryTabText, active && styles.expiryTabTextActive]}>{label}</Text>
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: badgeColor || '#8E8E93' }]}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 20, alignItems: 'center' },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: COLORS.textSub, letterSpacing: 1.5 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.textMain },
  fab: { backgroundColor: COLORS.primary, width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  filterBar: { flexDirection: 'row', paddingHorizontal: 25, gap: 10, marginBottom: 15 },
  filterBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: 'white', borderWidth: 1, borderColor: '#EFEEF3' },
  filterBtnActive: { backgroundColor: COLORS.textMain, borderColor: COLORS.textMain },
  filterText: { fontSize: 12, fontWeight: '700', color: COLORS.textSub },
  filterTextActive: { color: 'white' },
  expiryTabs: { paddingHorizontal: 25, gap: 10, paddingBottom: 20 },
  expiryTab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#F2F2F2', borderWidth: 1, borderColor: 'transparent' },
  expiryTabActive: { backgroundColor: 'white', borderColor: '#EFEEF3', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 2 } }) },
  tabContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expiryTabText: { fontSize: 12, fontWeight: '700', color: '#8E8E93' },
  expiryTabTextActive: { color: '#1C1C1E' },
  badge: { minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '900' },
  listContent: { paddingHorizontal: 0, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: COLORS.textSub, fontSize: 14, fontWeight: '600', marginTop: 10 }
});