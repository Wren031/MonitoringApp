import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { HistoryItem } from '../types/HistoryItem';

const SEVEN_COLORS = {
  green: '#008163',
  orange: '#F48221',
  red: '#EE2724',
  black: '#222222',
  white: '#FFFFFF',
  gray: '#888888',
  border: '#E0E0E0'
};

export const HistoryCard = React.memo(({ item }: { item: HistoryItem }) => {
  let iconName: keyof typeof Ionicons.glyphMap = "add-circle";
  let iconColor = SEVEN_COLORS.green;

  if (item.type === 'DELETE') { 
    iconName = "trash"; 
    iconColor = SEVEN_COLORS.red; 
  } else if (item.type === 'CAT') { 
    iconName = "grid"; 
    iconColor = SEVEN_COLORS.orange; 
  }

  return (
    <View style={styles.card}>
      {/* 7-Eleven Iconic Tri-Stripe Accent */}
      <View style={styles.brandStripes}>
        <View style={[styles.stripe, { backgroundColor: SEVEN_COLORS.orange }]} />
        <View style={[styles.stripe, { backgroundColor: SEVEN_COLORS.green }]} />
        <View style={[styles.stripe, { backgroundColor: SEVEN_COLORS.red }]} />
      </View>

      <View style={styles.contentContainer}>
        {/* Modernized Icon Box with high contrast */}
        <View style={[styles.iconBox, { backgroundColor: iconColor + '15' }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.topRow}>
            <Text style={[styles.actionText, { color: iconColor }]}>
              {item.action.toUpperCase()}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          
          <Text style={styles.itemText} numberOfLines={1}>{item.item.name}</Text>
          
          <View style={styles.detailsRow}>
            <View style={styles.catBadge}>
               <Text style={styles.catBadgeText}>{item.category.name}</Text>
            </View>
            <View style={styles.dotSeparator} />
            <Text style={styles.expiryText}>EXP: {item.expiry}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { 
    backgroundColor: SEVEN_COLORS.white, 
    borderRadius: 14, 
    flexDirection: 'row', 
    marginBottom: 12, 
    marginHorizontal: 16, 
    overflow: 'hidden',
    // High-end retail shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1, 
    borderColor: SEVEN_COLORS.border 
  },
  brandStripes: {
    width: 6,
    height: '100%',
  },
  stripe: {
    flex: 1,
  },
  contentContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    padding: 14, 
    alignItems: 'center' 
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14 
  },
  textContainer: { flex: 1 },
  topRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  actionText: { 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 0.5 
  },
  timeText: { 
    fontSize: 11, 
    color: SEVEN_COLORS.gray, 
    fontWeight: '600' 
  },
  itemText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: SEVEN_COLORS.black,
    marginBottom: 4
  },
  detailsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 4 
  },
  catBadge: { 
    backgroundColor: '#F0F0F0', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8'
  },
  catBadgeText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: '#666', 
    textTransform: 'uppercase' 
  },
  dotSeparator: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: '#DDD', 
    marginHorizontal: 10 
  },
  expiryText: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: SEVEN_COLORS.red 
  },
});