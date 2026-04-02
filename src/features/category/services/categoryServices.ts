import { supabase } from "@/src/lib/supabase";
import { CategoryItem } from "../types/CategoryItem";

export const categoryServices = {
    
    async fetchCategories(): Promise<CategoryItem[]> {
        const { data, error } = await supabase
            .from('tbl_category')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
        return data as CategoryItem[];
    },

    async addCategory(name: string, userId: string): Promise<CategoryItem | null> {
        const { data, error } = await supabase
            .from('tbl_category')
            .insert({ 
                name, 
                user_id: userId
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding category:', error);
            return null;
        }
        return data as CategoryItem;
    },

    async updateCategory(id: string, name: string): Promise<CategoryItem | null> {
        const { data, error } = await supabase
            .from('tbl_category')
            .update({ name })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating category:', error);
            return null;
        }
        return data as CategoryItem;
    },

    async deleteCategory(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('tbl_category')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return false;
        }
        return true;
    },
};