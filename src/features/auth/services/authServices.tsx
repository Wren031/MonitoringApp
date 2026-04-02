import { supabase } from "@/src/lib/supabase";
import { LoginCredentials, UserProfile } from "../types/auth";

export const authServices = {
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // ✅ Set status to 'Active' upon successful login
    if (data.user) {
      await supabase
        .from("tbl_profiles")
        .update({ status: 'Active' })
        .eq("id", data.user.id);
    }

    return data;
  },

  async logout() {
    // 1. Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    // ✅ 2. Set status to 'Not Active' before signing out
    if (session?.user) {
      await supabase
        .from("tbl_profiles")
        .update({ status: 'Not Active' })
        .eq("id", session.user.id);
    }

    // 3. Sign out of Supabase Auth
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  async signUp(userData: UserProfile) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password!,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from("tbl_profiles")
        .insert([{
          id: authData.user.id,
          full_name: userData.full_name,
          gender: userData.gender,
          address: userData.address,
          email: userData.email,
          status: 'Active', // Default to Active on signup
        }]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("tbl_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};