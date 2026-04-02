import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoryServices } from '../services/categoryServices';
import { CategoryItem } from '../types/CategoryItem';

export const useCategories = (MOCK_CATEGORIES: CategoryItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);


  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryServices.fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);

      setCategories(MOCK_CATEGORIES); 
    } finally {
      setLoading(false);
    }
  }, [MOCK_CATEGORIES]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

const addCategory = async (name: string, userId: string) => {
    if (!userId) return; // Safety check
    
    setLoading(true);
    try {
      // Pass userId to the service
      const newCategory = await categoryServices.addCategory(name, userId);
      if (newCategory) {
        setCategories(prev => [newCategory, ...prev]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateCategory = async (id: string, name: string) => {
    setLoading(true);
    try {
      const updatedCategory = await categoryServices.updateCategory(id, name);
      if (updatedCategory) {
        setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
      }
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      const success = await categoryServices.deleteCategory(id);
      if (success) { 
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchCategories();

  return {
    categories: filteredCategories, 
    loading,
    searchQuery,
    setSearchQuery,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh
  };
};