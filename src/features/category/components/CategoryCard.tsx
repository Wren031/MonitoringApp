import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryItem } from '../types/CategoryItem';

const { width } = Dimensions.get('window');
const SPACING = 12;
const COLUMN_WIDTH = (width - (SPACING * 3)) / 2;

const SEVEN_GREEN = '#00843D';
const SEVEN_ORANGE = '#F4811F';
const SEVEN_RED = '#EE2737';

interface CategoryCardProps {
  item: CategoryItem;
  onPress: (item: CategoryItem) => void;
  onMenuPress?: (item: CategoryItem) => void; // Optional prop if you want to handle the dots separately
}

export const CategoryCard = memo(({ item, onPress, onMenuPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={() => onPress(item)}
    >
      {/* Vertical Stripe Accent on the Left */}
      <View style={styles.stripeContainer}>
        <View style={[styles.stripe, { backgroundColor: SEVEN_ORANGE }]} />
        <View style={[styles.stripe, { backgroundColor: SEVEN_GREEN }]} />
        <View style={[styles.stripe, { backgroundColor: SEVEN_RED }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons 
            name={(item as any).icon || "apps-outline"} 
            size={24} 
            color={SEVEN_GREEN} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* The 3 Dots Menu */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => onMenuPress?.(item)} // Call onMenuPress if provided
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: COLUMN_WIDTH,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: SPACING,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    // Elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stripeContainer: {
    flexDirection: 'column',
    width: 6,
    height: '100%',
  },
  stripe: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  menuButton: {
    position: 'absolute',
    top: 5,                  // Small adjustments to the positioning for better balance
    right: 5,
    width: 28,               // Slightly wider to create a better hit area for the menu
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});