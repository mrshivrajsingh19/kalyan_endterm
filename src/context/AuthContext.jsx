import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isMocked } from '../services/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMocked) {
      // Mocked Auth for demo
      const localUser = localStorage.getItem('mockUser');
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
      setLoading(false);
      return;
    }

    // Real Supabase Auth
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (isMocked) {
      const mockUser = { id: 'mock-123', email };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signup = async (email, password) => {
    if (isMocked) {
      const mockUser = { id: 'mock-123', email };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser, error: null };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const logout = async () => {
    if (isMocked) {
      localStorage.removeItem('mockUser');
      setUser(null);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isMocked }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
