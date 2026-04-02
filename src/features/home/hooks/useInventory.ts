import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoryServices } from '../../category/services/categoryServices';
import { inventoryServices } from '../../inventory/services/inventoryServices';

// --- Date Helpers ---
export const parseExpiryDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const months: { [key: string]: number } = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };
  const parts = dateStr.replace(',', '').split(' ');
  let date = parts.length === 3 
    ? new Date(parseInt(parts[2]), months[parts[0].toLowerCase()], parseInt(parts[1]))
    : new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getDaysRemaining = (expiryDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export type FilterMode = 'ALL' | 'EXPIRED' | 'PRIORITY' | 'HEALTHY';

export const useInventory = (profile?: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterMode>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const [inventory, setInventory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [invData, catData] = await Promise.all([
        inventoryServices.fetchInventory(),
        categoryServices.fetchCategories()
      ]);
      setInventory(invData || []);
      setCategories(catData || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const refresh = () => loadData(); // Expose refresh for manual reloads

  const saveProduct = async (form: any, editingId: string | null) => {
      const productPayload = {
        name: form.name,
        expiry: form.expiry,
        isHidden: form.isHidden, // This is mapped inside the service now
        category_id: form.category?.id,
        user_id: profile?.id,
      };

      try {
        let result;
        if (editingId) {
          result = await inventoryServices.updateProduct(editingId, productPayload);
        } else {
          result = await inventoryServices.addProduct(productPayload); 
        }

        if (result) {
          await refresh(); // Force reload to update list
          return true;
        }
      } catch (error) {
        console.error("Save error:", error);
        return false;
      }
    };

  const deleteProduct = async (id: string) => {
    const success = await inventoryServices.deleteProduct(id);
    if (success) await loadData();
    return success;
  };

  const processedData = useMemo(() => {
    // 1. Merge category names into items
    const merged = inventory.map(item => ({
      ...item,
      category: categories.find(c => c.id === item.category_id) || { name: 'Uncategorized' }
    }));

    // 2. Main list filtering (Search + Tabs + Categories)
    let filtered = merged.filter(item => 
      item.isHidden === showHidden && 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategoryId) {
      filtered = filtered.filter(item => item.category_id === selectedCategoryId);
    }

    // 3. Status Grouping
    const expired = filtered.filter(i => getDaysRemaining(parseExpiryDate(i.expiry)) <= 0);
    const priority = filtered.filter(i => {
      const d = getDaysRemaining(parseExpiryDate(i.expiry));
      return d > 0 && d <= 10;
    });
    const healthy = filtered.filter(i => getDaysRemaining(parseExpiryDate(i.expiry)) > 10);

    // 4. Notifications Logic (Used by Notification Screen)
    const notifications = merged
      .filter(item => !item.isHidden) // Only alert on active items
      .map(item => {
        const days = getDaysRemaining(parseExpiryDate(item.expiry));
        if (days <= 0) return { ...item, alertType: 'EXPIRED', color: '#EE2722', icon: 'alert-circle' };
        if (days <= 7) return { ...item, alertType: 'SOON', color: '#F57E20', icon: 'time' };
        return null;
      }).filter(Boolean);

    let displayList = filtered;
    if (filterType === 'EXPIRED') displayList = expired;
    if (filterType === 'PRIORITY') displayList = priority;
    if (filterType === 'HEALTHY') displayList = healthy;

    return { total: filtered.length, expired, priority, healthy, displayList, notifications };
  }, [inventory, categories, searchQuery, filterType, selectedCategoryId, showHidden]);

  return {
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    selectedCategoryId, setSelectedCategoryId,
    showHidden, setShowHidden,
    categories, loading, processedData,
    refresh,
    saveProduct, deleteProduct
  };
};