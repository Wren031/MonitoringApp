import { MOCK_CATEGORIES } from '@/src/data/inventoryData';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert, FlatList, KeyboardAvoidingView, Modal, Platform,
  RefreshControl,
  SafeAreaView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';

import { useAuth } from '../../auth/hooks/useAuth';
import { CategoryCard } from '../components/CategoryCard';
import { useCategories } from '../hooks/useCategories';
import { BRAND, CategoryItem } from '../types/CategoryItem';

export default function CategoryScreen() {
  const { 
    categories,
    loading,
    searchQuery, 
    setSearchQuery, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    refresh
  } = useCategories(MOCK_CATEGORIES);
  const { profile } = useAuth();

  const [isModalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');



  const openModal = (item?: CategoryItem) => {
    if (item) {
      setEditingId(item.id);
      setNameInput(item.name);
    } else {
      setEditingId(null);
      setNameInput('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setNameInput('');
  };

  // The 3-dots Menu Logic
  const handleShowMenu = (item: CategoryItem) => {
    Alert.alert(
      item.name.toUpperCase(),
      "Manage this department",
      [
        { text: "Update", onPress: () => openModal(item) },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => confirmDelete(item.id) 
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

const handleSave = () => {
  if (!nameInput.trim()) return;

  if (editingId) {
    // Updating doesn't strictly need the userId if RLS is on, 
    // but the ID of the category is required.
    updateCategory(editingId, nameInput);
  } else {
    // IMPORTANT: Pass the profile ID when creating a new category
    if (profile?.id) {
      addCategory(nameInput, profile.id);
    } else {
      console.error("No user profile found. Cannot save category.");
      // Optional: Show an alert to the user
    }
  }

  closeModal();
};

  const confirmDelete = (id: string) => {
    Alert.alert("Delete", "Remove this department permanently?", [
      { text: "Cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => deleteCategory(id)
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>INVENTORY</Text>
          <Text style={styles.headerTitle}>Departments</Text>
        </View>
        <TouchableOpacity style={styles.squareAddButton} onPress={() => openModal()}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={BRAND.SUBTLE} style={{ marginRight: 10 }} />
          <TextInput 
            placeholder="Search departments..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={BRAND.SUBTLE}
          />
        </View>
      </View>

      {loading && categories.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND.GREEN} />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryCard 
              item={item} 
              onPress={(item) => console.log('Open Department:', item.name)} 
              onMenuPress={handleShowMenu} // Pass the menu handler here
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={BRAND.GREEN} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No departments found</Text>
            </View>
          )}
        />
      )}

      {/* Modal for Add/Update */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.dismissArea} onPress={closeModal} activeOpacity={1} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Dept' : 'New Dept'}</Text>
            </View>
            <TextInput 
              style={styles.inputField} 
              placeholder="Enter department name" 
              value={nameInput} 
              onChangeText={setNameInput} 
              autoFocus 
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingId ? 'SAVE CHANGES' : 'CREATE DEPARTMENT'}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.WHITE },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15 },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: BRAND.GREEN, letterSpacing: 2 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: BRAND.DARK },
  squareAddButton: { backgroundColor: BRAND.GREEN, width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  searchSection: { paddingHorizontal: 20, paddingVertical: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: BRAND.OFF_WHITE, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12 },
  searchInput: { flex: 1, fontSize: 16, color: BRAND.DARK },
  listContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  columnWrapper: { justifyContent: 'space-between' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  bottomSheet: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 5, backgroundColor: BRAND.BORDER, borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: BRAND.DARK },
  inputField: { backgroundColor: BRAND.OFF_WHITE, padding: 18, borderRadius: 12, fontSize: 16, marginBottom: 30 },
  saveButton: { backgroundColor: BRAND.GREEN, padding: 20, borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: '900', fontSize: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: BRAND.SUBTLE, fontSize: 16, fontWeight: '600' }
});