import { COLORS } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CategoryItem } from '../../category/types/CategoryItem';
import { Product } from '../types/InventoryTypes';

interface ProductModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  form: Product;
  setForm: (form: Product) => void;
  categories: CategoryItem[];
  editingId: string | null;
}

export const ProductModal = ({ 
  isVisible, onClose, onSave, form, setForm, categories, editingId 
}: ProductModalProps) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());


  useEffect(() => {
    if (form?.expiry) {
      const d = new Date(form.expiry);
      if (!isNaN(d.getTime())) setTempDate(d);
    }
  }, [isVisible]);

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleConfirmDate = () => {
    setForm({ ...form, expiry: formatDateLabel(tempDate) });
    setIsDatePickerVisible(false);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android' && event.type === 'set') {
        setForm({ ...form, expiry: formatDateLabel(selectedDate) });
        setIsDatePickerVisible(false);
      }
    } else if (Platform.OS === 'android' && event.type === 'dismissed') {
      setIsDatePickerVisible(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalSubtitle}>{editingId ? 'STOCK UPDATE' : 'NEW ENTRY'}</Text>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Product' : 'Add Product'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={15}>
              <Ionicons name="close-circle" size={32} color={COLORS.textSub || '#8E8E93'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.label}>PRODUCT NAME</Text>
            <TextInput 
              style={styles.input} 
              value={form?.name || ''} 
              onChangeText={t => setForm({...form, name: t})} 
              placeholder="e.g. Big Gulp Syrup"
              placeholderTextColor="#A9A9A9"
            />

            <Text style={styles.label}>EXPIRY DATE</Text>
            <TouchableOpacity style={styles.dateSelector} onPress={() => setIsDatePickerVisible(true)}>
              <Text style={[styles.dateText, { color: form?.expiry ? '#1A1A1A' : '#8E8E93' }]}>
                {form?.expiry || "Select Date"}
              </Text>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.label}>SELECT DEPARTMENT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories && categories.map((cat) => {
                const isSelected = form?.category?.id === cat.id;
                return (
                  <TouchableOpacity 
                    key={cat.id} 
                    style={[styles.catPill, isSelected && styles.catPillActive]} 
                    onPress={() => setForm({...form, category: cat})}
                  >
                    <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.mainBtn} onPress={onSave}>
              <Text style={styles.mainBtnText}>{editingId ? 'UPDATE PRODUCT' : 'CONFIRM ADD'}</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Date Picker Logic */}
          <Modal visible={isDatePickerVisible} transparent animationType="fade">
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setIsDatePickerVisible(false)}><Text style={styles.pickerCancel}>Cancel</Text></TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select Expiry</Text>
                  <TouchableOpacity onPress={handleConfirmDate}><Text style={styles.pickerConfirm}>Confirm</Text></TouchableOpacity>
                </View>
                <DateTimePicker value={tempDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} minimumDate={new Date()} />
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalSubtitle: { fontSize: 10, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
  label: { fontSize: 11, fontWeight: '800', color: '#8E8E93', marginTop: 20, marginBottom: 10, letterSpacing: 1 },
  input: { backgroundColor: '#F2F2F7', height: 56, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E5EA', fontSize: 16, fontWeight: '600' },
  dateSelector: { backgroundColor: '#F2F2F7', height: 56, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E5EA', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 16, fontWeight: '600' },
  catScroll: { flexDirection: 'row' },
  catPill: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F2F2F7', marginRight: 10, borderWidth: 1, borderColor: '#E5E5EA' },
  catPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catPillText: { fontSize: 14, fontWeight: '700', color: '#8E8E93' },
  catPillTextActive: { color: 'white' },
  mainBtn: { height: 60, backgroundColor: COLORS.primary, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  mainBtnText: { color: 'white', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  pickerContainer: { backgroundColor: 'white', borderRadius: 24, width: '90%', padding: 15 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F2F2F7', paddingBottom: 15, marginBottom: 10 },
  pickerTitle: { fontWeight: '800', color: '#1A1A1A' },
  pickerCancel: { color: '#EE2722', fontWeight: '700' },
  pickerConfirm: { color: COLORS.primary, fontWeight: '800' }
});