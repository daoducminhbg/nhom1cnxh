'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthState } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (userId: string, pin: string) => Promise<boolean>;
  createPin: (userId: string, pin: string) => Promise<boolean>;
  logout: () => void;
  checkUserHasPin: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'nhom1cnxh_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error || !data) return null;
    return data as User;
  }, []);

  useEffect(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY);
    if (savedUserId) {
      fetchUser(savedUserId).then((u) => {
        if (u) setUser(u);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (userId: string, pin: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('pin_code', pin)
      .single();
    if (error || !data) return false;
    const u = data as User;
    setUser(u);
    localStorage.setItem(STORAGE_KEY, u.id);
    return true;
  };

  const createPin = async (userId: string, pin: string): Promise<boolean> => {
    const { error } = await supabase
      .from('users')
      .update({ pin_code: pin })
      .eq('id', userId);
    if (error) return false;
    const u = await fetchUser(userId);
    if (u) {
      setUser(u);
      localStorage.setItem(STORAGE_KEY, u.id);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const checkUserHasPin = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('users')
      .select('pin_code')
      .eq('id', userId)
      .single();
    return !!(data && data.pin_code);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        createPin,
        logout,
        checkUserHasPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
