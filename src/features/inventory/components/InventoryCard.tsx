import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActionSheetIOS, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { getDaysRemaining, parseExpiryDate } from '../../home/hooks/useInventory';
import { Product } from '../types/InventoryTypes';

const SEVEN_COLORS = {
  green: '#008163',
  orange: '#F48221',
  red: '#EE2724',
  white: '#FFFFFF',
  gray: '#6E6E6E',
  border: '#E0E4E2',
  textDark: '#1A1A1A'
};

interface Props {
  item: Product;
  onPress: (item: Product) => void;
  onHide: (item: Product) => void;
  onDelete: (id: string) => void;
}

export const InventoryCard = ({ item, onPress, onHide, onDelete }: Props) => {
  
  // Use your existing robust parser for the display date too
  const displayDate = useMemo(() => {
    if (!item.expiry) return 'N/A';
    try {
      const dateObj = parseExpiryDate(item.expiry);
      return dateObj.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return item.expiry;
    }
  }, [item.expiry]);

  const status = useMemo(() => {
    const days = getDaysRemaining(parseExpiryDate(item.expiry));
    
    if (days <= 0) return { bg: SEVEN_COLORS.red, text: '#FFF', label: 'EXPIRED' };
    
    const label = days === 1 ? '1 DAY LEFT' : `${days} DAYS LEFT`;
    
    if (days <= 10) return { bg: SEVEN_COLORS.orange, text: '#FFF', label };
    return { bg: '#E8F5E9', text: SEVEN_COLORS.green, label };
  }, [item.expiry]);

  const handleMorePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', item.isHidden ? 'Unhide' : 'Hide', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) onHide(item);
          if (buttonIndex === 2) onDelete(item.id);
        }
      );
    }
  };

  return (
    <Swipeable 
      renderRightActions={() => (
        <TouchableOpacity style={styles.swipeDelete} onPress={() => onDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.swipeText}>Delete</Text>
        </TouchableOpacity>
      )}
      overshootRight={false}
    >
      <TouchableOpacity 
        style={[styles.card, item.isHidden && styles.cardHidden]} 
        onPress={() => onPress(item)} 
        activeOpacity={0.9}
      >
        <View style={styles.brandStripe}>
            <View style={{height: 12, backgroundColor: SEVEN_COLORS.orange}} />
            <View style={{height: 12, backgroundColor: SEVEN_COLORS.red}} />
            <View style={{flex: 1, backgroundColor: SEVEN_COLORS.green}} />
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.leftContent}>

            <Text style={styles.itemMeta}>
              {(item.category?.name || 'Uncategorized').toUpperCase()}
            </Text>
            
            <View style={styles.titleRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              {item.isHidden && <Ionicons name="eye-off" size={14} color="#BBB" style={{marginLeft: 6}}/>}
            </View>
            
            <View style={styles.dateRow}>
              <Text style={styles.expiryLabel}>EXPIRY</Text>
              <Text style={styles.expiryDateText}>{displayDate}</Text>
            </View>
          </View>

          <View style={styles.rightContent}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
            </View>
            
            <TouchableOpacity onPress={handleMorePress} style={styles.moreButton} hitSlop={15}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    marginBottom: 12, 
    marginHorizontal: 16, 
    flexDirection: 'row', 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: SEVEN_COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  brandStripe: { width: 5, height: '100%' },
  cardHidden: { opacity: 0.5 },
  mainContainer: { flex: 1, flexDirection: 'row', padding: 16, alignItems: 'center' },
  leftContent: { flex: 1 },
  itemMeta: { fontSize: 10, fontWeight: '900', color: SEVEN_COLORS.green, marginBottom: 2, letterSpacing: 1.2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  itemName: { fontSize: 17, fontWeight: '700', color: SEVEN_COLORS.textDark },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  expiryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: SEVEN_COLORS.gray,
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#DDD',
    paddingRight: 8
  },
  expiryDateText: { fontSize: 12, color: SEVEN_COLORS.textDark, fontWeight: '600' },
  rightContent: { alignItems: 'flex-end', justifyContent: 'space-between', height: 60, paddingLeft: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, minWidth: 95, alignItems: 'center' },
  statusText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  moreButton: { padding: 4 },
  swipeDelete: { backgroundColor: SEVEN_COLORS.red, width: 80, height: '88%', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  swipeText: { color: 'white', fontSize: 10, fontWeight: '800', marginTop: 4, textTransform: 'uppercase' }
});