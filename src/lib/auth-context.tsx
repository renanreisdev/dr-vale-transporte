'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthSession, UserRole } from '@/types/auth';
import { supabase, isSupabaseConfigured } from './supabase';

const AUTH_STORAGE_KEY = 'dr_vale_auth_session_v1';
const MASTER_EMAILS = [
  'renanreis.dev@gmail.com',
  'admin@drvale.com.br',
  (process.env.NEXT_PUBLIC_MASTER_EMAILS || '').toLowerCase(),
].filter(Boolean);

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isMaster: boolean;
  isDemo: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string,
    companyName: string
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (companyName?: string) => void;
  logout: () => void;
  switchRoleForDev: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkIsMaster = (email: string): boolean => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return MASTER_EMAILS.some((m) => m === clean || clean.includes('renanreis.dev'));
  };

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check Supabase auth if configured
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const sbUser = data.session.user;
            const email = sbUser.email || '';
            const isMaster = checkIsMaster(email);
            const authUser: AuthUser = {
              id: sbUser.id,
              email,
              name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0],
              avatarUrl: sbUser.user_metadata?.avatar_url,
              companyName: sbUser.user_metadata?.company_name || 'Minha Empresa',
              role: isMaster ? 'master' : 'client',
              isMaster,
              createdAt: sbUser.created_at || new Date().toISOString(),
            };
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
            setIsLoading(false);
            return;
          }
        }

        // 2. Check localStorage session
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          const parsed: AuthUser = JSON.parse(saved);
          setUser(parsed);
        } else {
          // If no session exists yet, default to a friendly Demo session so visitor doesn't get blocked
          const defaultDemoUser: AuthUser = {
            id: 'demo-user-1',
            email: 'demo@drvale.com.br',
            name: 'Visitante Demo',
            companyName: 'SIDIAL FERRAGENS',
            role: 'demo',
            isMaster: false,
            createdAt: new Date().toISOString(),
          };
          setUser(defaultDemoUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultDemoUser));
        }
      } catch (err) {
        console.error('Error restoring auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state changes if enabled
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const isMaster = checkIsMaster(email);
          const authUser: AuthUser = {
            id: session.user.id,
            email,
            name: session.user.user_metadata?.full_name || email.split('@')[0],
            avatarUrl: session.user.user_metadata?.avatar_url,
            companyName: session.user.user_metadata?.company_name || 'Minha Empresa',
            role: isMaster ? 'master' : 'client',
            isMaster,
            createdAt: session.user.created_at,
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        } else if (event === 'SIGNED_OUT') {
          // Do not delete demo mode on sign out
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Login with Email/Password
  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // If Supabase is connected
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      const isMaster = checkIsMaster(cleanEmail);
      const authUser: AuthUser = {
        id: data.user.id,
        email: cleanEmail,
        name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
        companyName: data.user.user_metadata?.company_name || 'SIDIAL FERRAGENS',
        role: isMaster ? 'master' : 'client',
        isMaster,
        createdAt: data.user.created_at,
      };

      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    }

    // Local / Offline authentication simulation
    const isMaster = checkIsMaster(cleanEmail);
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0].toUpperCase(),
      companyName: isMaster ? 'DR VALE ADMIN' : 'SIDIAL FERRAGENS',
      role: isMaster ? 'master' : 'client',
      isMaster,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  // Register with Email
  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
    companyName: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: name,
            company_name: companyName,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const isMaster = checkIsMaster(cleanEmail);
        const authUser: AuthUser = {
          id: data.user.id,
          email: cleanEmail,
          name,
          companyName,
          role: isMaster ? 'master' : 'client',
          isMaster,
          createdAt: data.user.created_at,
        };
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      }
      return { success: true };
    }

    // Offline registration simulation
    const isMaster = checkIsMaster(cleanEmail);
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      name,
      companyName,
      role: isMaster ? 'master' : 'client',
      isMaster,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  // Login with Google / Gmail
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) return { success: false, message: error.message };
      return { success: true };
    }

    // Google Login simulation for instant testing/demo when Supabase keys are not set
    const mockEmail = 'renanreis.dev@gmail.com'; // Log as Master user via Gmail simulation
    const isMaster = true;
    const authUser: AuthUser = {
      id: 'google-user-1',
      email: mockEmail,
      name: 'Renan Reis',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      companyName: 'DR VALE MASTER',
      role: 'master',
      isMaster: true,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  };

  // Instant 1-Click Demo Login
  const loginAsDemo = (companyName: string = 'SIDIAL FERRAGENS') => {
    const demoUser: AuthUser = {
      id: 'demo-' + Date.now(),
      email: 'demo.cliente@empresa.com.br',
      name: 'Cliente em Demonstração',
      companyName,
      role: 'demo',
      isMaster: false,
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Set to demo or null
    loginAsDemo();
  };

  // Role Switcher for Developer / Demonstration
  const switchRoleForDev = (role: UserRole) => {
    if (!user) return;
    const updated: AuthUser = {
      ...user,
      role,
      isMaster: role === 'master',
    };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.role !== 'demo',
        isMaster: !!user?.isMaster,
        isDemo: user?.role === 'demo',
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemo,
        logout,
        switchRoleForDev,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
