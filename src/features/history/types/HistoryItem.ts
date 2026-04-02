import { CategoryItem } from "../../category/types/CategoryItem";


export type HistoryType = 'ADD' | 'DELETE' | 'CAT';

export interface HistoryItem {
  id: string;
  action: string;
  item: string;
  category: CategoryItem;
  expiry: string;
  time: string;
  type: HistoryType;
}

export type FilterType = 'All' | 'Additions' | 'Removals';