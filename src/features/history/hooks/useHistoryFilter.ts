import { useMemo, useState } from 'react';
import { FilterType, HistoryItem } from '../types/HistoryItem';

export const useHistoryFilter = (initialData: HistoryItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredData = useMemo(() => {
    return initialData.filter((log) => {
      const matchesSearch = 
        log.item.category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.action.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        activeFilter === 'All' || 
        (activeFilter === 'Additions' && log.type === 'ADD') || 
        (activeFilter === 'Removals' && log.type === 'DELETE'); // Changed from Updates to Removals

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, initialData]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredData,
  };
};