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
    if (!email) return;
    try {
      // Use a timeout for the DB query to prevent hanging the whole app
      const profilePromise = supabase
        .from('Auth')
        .select('*')
        .eq('emailaddress', email)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      );

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]);
        
      if (error) {
        console.warn('Profile fetch error (Auth table might not exist):', error.message);
        setUserProfile({ fullname: 'CodeMind User', emailaddress: email });
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      console.warn('Silent failure on profile fetch:', err.message);
      setUserProfile({ fullname: 'CodeMind User', emailaddress: email });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        // Initial session check
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          if (session?.user?.email) {
            await fetchProfile(session.user.email);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Session initialization failed:', err);
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    // Listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        if (newSession?.user?.email) {
          await fetchProfile(newSession.user.email);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    userProfile,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
      setSession(null);
      setUserProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
