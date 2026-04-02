import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { categoryServices } from '../../category/services/categoryServices';
import { CategoryItem } from '../../category/types/CategoryItem';
import { inventoryServices } from '../services/inventoryServices';
import { Product } from '../types/InventoryTypes';

export const useInventory = () => {

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);

  const { profile } = useAuth();
  const [inventory, setInventory] = useState<Product[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inventoryData, categoryData] = await Promise.all([
        inventoryServices.fetchInventory(),
        categoryServices.fetchCategories() 
      ]);

      setInventory(inventoryData);
      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to load inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

const saveProduct = async (form: any, editingId: string | null) => {
  // Combine everything into ONE object
  const productPayload = {
    name: form.name,
    expiry: form.expiry,
    isHidden: form.isHidden,
    category_id: form.category?.id,
    user_id: profile?.id, // 👈 Use 'user_id' to match your table in Image 3
  };

  let result;
  if (editingId) {
    result = await inventoryServices.updateProduct(editingId, productPayload);
  } else {
    // ✅ PASS ONLY ONE ARGUMENT
    result = await inventoryServices.addProduct(productPayload); 
  }

  if (result) {
    await fetchData();
    return true;
  }
};

  const deleteProduct = async (id: string) => {
    const success = await inventoryServices.deleteProduct(id);
    if (success) {
      setInventory(prev => prev.filter(i => i.id !== id));
      return true;
    }
    return false;
  };

  const refresh = () => fetchData();

  return { 
    inventory, 
    categories,
    loading, 
    showHidden, 
    setShowHidden, 
    saveProduct, 
    deleteProduct, 
    refresh 
  };
};