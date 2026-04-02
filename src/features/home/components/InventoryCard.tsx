import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Product } from '../../inventory/types/InventoryTypes';
import { getDaysRemaining, parseExpiryDate } from '../hooks/useInventory';

const BRAND = { 
  GREEN: '#008163', 
  ORANGE: '#F57E20', 
  RED: '#EE2722', 
  WHITE: '#FFFFFF', 
  TEXT_DARK: '#1A1A1A', 
  TEXT_MUTED: '#6E6E6E',
  BORDER: '#E0E4E2'
};

interface InventoryCardProps {
  item: Product;
  onPress?: () => void;
}

export const InventoryCard = ({ item, onPress }: InventoryCardProps) => {
  // Use the custom parser consistently
  const expiryDateObject = useMemo(() => parseExpiryDate(item.expiry), [item.expiry]);

  const status = useMemo(() => {
    const days = getDaysRemaining(expiryDateObject);
    
    if (days <= 0) return { bg: BRAND.RED, text: BRAND.WHITE, label: 'EXPIRED' };
    if (days <= 10) return { bg: BRAND.ORANGE, text: BRAND.WHITE, label: `${days} DAYS LEFT` };
    return { bg: '#E8F5E9', text: BRAND.GREEN, label: 'HEALTHY' };
  }, [expiryDateObject]);

  const displayDate = useMemo(() => {
    try {
      return expiryDateObject.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return item.expiry; // Fallback if date object is invalid
    }
  }, [expiryDateObject, item.expiry]);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {/* 7-Eleven Signature Vertical Tri-Stripe */}
      <View style={styles.stripeContainer}>
        <View style={[styles.stripe, { backgroundColor: BRAND.ORANGE, height: 12 }]} />
        <View style={[styles.stripe, { backgroundColor: BRAND.RED, height: 12 }]} />
        <View style={[styles.stripe, { backgroundColor: BRAND.GREEN, flex: 1 }]} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.cardLeft}>
          {/* FIX: Added optional chaining and a fallback for category name */}
          <Text style={styles.cardCategory}>
            {(item.category?.name || 'Uncategorized').toUpperCase()}
          </Text>
          
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.cardMeta}>
            <Text style={styles.metaLabel}>EXPIRY</Text>
            <Text style={styles.cardExpiry}>{displayDate}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: BRAND.WHITE, 
    borderRadius: 10, 
    marginBottom: 12, 
    flexDirection: 'row', 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: BRAND.BORDER,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  stripeContainer: { width: 5 },
  stripe: { width: '100%' },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardLeft: { flex: 1, paddingRight: 8 },
  cardCategory: { 
    fontSize: 10, 
    color: BRAND.GREEN, 
    fontWeight: '900', 
    letterSpacing: 1.5,
    marginBottom: 2
  },
  cardName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: BRAND.TEXT_DARK,
    marginBottom: 8
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: BRAND.TEXT_MUTED,
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#DDD',
    paddingRight: 8
  },
  cardExpiry: { 
    fontSize: 13, 
    color: BRAND.TEXT_DARK,
    fontWeight: '600'
  },
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 6, 
    minWidth: 95, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 0.5 
  },
});