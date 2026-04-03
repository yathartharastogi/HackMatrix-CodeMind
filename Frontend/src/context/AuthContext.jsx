import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch custom profile
  const fetchProfile = async (email) => {
    try {
      const { data, error } = await supabase
        .from('Auth')
        .select('*')
        .eq('emailaddress', email)
        .single();
        
      if (error) {
        console.error('Error fetching Auth profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user?.email) {
        await fetchProfile(session.user.email);
      }
      setLoading(false);
    };

    initializeAuth();

    // 2. Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        await fetchProfile(session.user.email);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    userProfile,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
      setUserProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
