

import { CategoryItem } from "../features/category/types/CategoryItem";
import { HistoryItem } from "../features/history/types/HistoryItem";
import { Product } from "../features/inventory/types/InventoryTypes";

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 'cat_1', name: 'Beverages',},
  { id: 'cat_2', name: 'Fresh Food',},
  { id: 'cat_3', name: 'Snacks',},
  { id: 'cat_4', name: 'Frozen Foods',},
];

export const INITIAL_INVENTORY: Product[] = [
  { id: '1', name: 'Hotdog Buns (6pk)', category: MOCK_CATEGORIES[1], expiry: '2026-03-30', isHidden: false },
  { id: '2', name: 'Fresh Egg Sandwich', category: MOCK_CATEGORIES[1], expiry: '2026-04-02', isHidden: false },
  { id: '3', name: 'Whole Milk 1L', category: MOCK_CATEGORIES[0], expiry: '2026-04-08', isHidden: false },
  { id: '4', name: 'Greek Yogurt', category: MOCK_CATEGORIES[1], expiry: '2026-04-10', isHidden: false },
  { id: '5', name: 'Slurpee Mix - Cherry', category: MOCK_CATEGORIES[0], expiry: '2026-05-30', isHidden: false },
  { id: '6', name: 'Nacho Cheese Sauce', category: MOCK_CATEGORIES[3], expiry: '2026-06-15', isHidden: false },
  { id: '7', name: 'Potato Chips - BBQ', category: MOCK_CATEGORIES[2], expiry: '2026-08-20', isHidden: false },
  { id: '8', name: '7-Select Water', category: MOCK_CATEGORIES[0], expiry: '2026-12-30', isHidden: false },
];

export const HISTORY_DATA: HistoryItem[] = [
  { 
    id: '1', 
    action: 'Added New Product', 
    item: INITIAL_INVENTORY[0],
    category: MOCK_CATEGORIES[1],
    expiry: 'Mar 30, 2026', 
    time: '2 mins ago', 
    type: 'ADD' 
  },
  { 
    id: '2', 
    action: 'Removed from Stock', 
    item: INITIAL_INVENTORY[5],
    category: MOCK_CATEGORIES[0], 
    expiry: 'Dec 15, 2026', 
    time: '1 hour ago', 
    type: 'DELETE' 
  },
  { 
    id: '3', 
    action: 'Added New Product', 
    item: INITIAL_INVENTORY[2],
    category: MOCK_CATEGORIES[1], 
    expiry: 'Today', 
    time: '3 hours ago', 
    type: 'ADD' 
  },
];

