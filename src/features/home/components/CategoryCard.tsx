import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryItem } from '../../category/types/CategoryItem';


const BRAND = { 
  GREEN: '#008163', 
  ORANGE: '#F57E20', 
  RED: '#EE2722', 
  WHITE: '#FFFFFF', 
  TEXT_DARK: '#1A1A1A', 
  TEXT_MUTED: '#6E6E6E',
  BORDER: '#E0E4E2'
};

interface CategoryCardProps {
  category: CategoryItem;
  onPress: () => void;
  itemCount?: number;
}

export const CategoryCard = ({ category, onPress, itemCount }: CategoryCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.categoryCard} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="folder-open" size={20} color={BRAND.GREEN} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {itemCount !== undefined && (
          <Text style={styles.itemCountText}>{itemCount} Products</Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color={BRAND.TEXT_MUTED} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: BRAND.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BRAND.BORDER,
    // Matching the shadow from your InventoryCard
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconContainer: {
    marginRight: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND.TEXT_DARK,
  },
  itemCountText: {
    fontSize: 12,
    color: BRAND.TEXT_MUTED,
    marginTop: 2,
    fontWeight: '500',
  },
});