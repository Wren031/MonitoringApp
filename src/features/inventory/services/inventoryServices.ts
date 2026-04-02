import { supabase } from '@/src/lib/supabase';
import { Product } from '../types/InventoryTypes';

export const inventoryServices = {
  // Fetch all products and their categories
async fetchInventory(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('tbl_product') 
      .select('*, tbl_category(*)')
      .order('created_at', { ascending: false });

    if (error) return [];

    // FIX: Map is_hidden to isHidden
    return (data as any[]).map(item => ({
      ...item,
      isHidden: item.is_hidden 
    })) as Product[];
  },

async addProduct(payload: any) {
    // FIX: Ensure payload sent to DB uses snake_case
    const dbPayload = { 
      ...payload, 
      is_hidden: payload.isHidden // Map for insert
    };
    delete dbPayload.isHidden; // Remove camelCase before sending

    const { data, error } = await supabase
      .from('tbl_product')
      .insert([dbPayload])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
async updateProduct(id: string, updates: any): Promise<Product | null> {
    // FIX: Ensure updates sent to DB use snake_case
    const dbUpdates = { 
      ...updates, 
      is_hidden: updates.isHidden 
    };
    delete dbUpdates.isHidden;
    delete dbUpdates.tbl_category; // Don't try to update the joined table

    const { data, error } = await supabase
      .from('tbl_product')
      .update(dbUpdates)
      .eq('id', id)
      .select('*, tbl_category(*)')
      .single();

    if (error) return null;
    return { ...data, isHidden: data.is_hidden } as Product;
  },
  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tbl_product')
      .delete()
      .eq('id', id);

    return !error;
  },
};