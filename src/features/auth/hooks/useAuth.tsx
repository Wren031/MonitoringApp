import { supabase } from "@/src/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { authServices } from "../services/authServices";
import { LoginCredentials, UserProfile } from "../types/auth";

export const useAuth = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const data = await authServices.getProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserData(session.user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) fetchUserData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  // Wrap login/logout to ensure loading states are handled
  const handleLogin = async (creds: LoginCredentials) => {
    setLoading(true);
    try {
      return await authServices.login(creds);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authServices.logout();
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    refreshProfile,
    login: handleLogin,
    signUp: (data: UserProfile) => authServices.signUp(data),
    logout: handleLogout,
    isAuthenticated: !!profile && profile.status === 'Active',
    isNotActive: !!profile && profile.status === 'Not Active',
  };
};