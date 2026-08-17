'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthSession, UserRole } from '@/types/auth';
import { supabase, isSupabaseConfigured } from './supabase';

const AUTH_STORAGE_KEY = 'dr_vale_auth_session_v1';

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

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check Supabase auth if configured
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const sbUser = data.session.user;
            const email = (sbUser.email || '').toLowerCase();
            const isMaster = email === 'renanreis.dev@gmail.com' || email.includes('master');
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
          // Default to Demo session
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
  }, []);

  // Login with Email/Password
  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Master Authentication via secure Server Route
    try {
      const masterRes = await fetch('/api/auth/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      if (masterRes.ok) {
        const masterData = await masterRes.json();
        if (masterData.success && masterData.user) {
          setUser(masterData.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(masterData.user));
          return { success: true };
        }
      }
    } catch {
      // ignore network failure and fall through
    }

    // 2. Check Supabase auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      const authUser: AuthUser = {
        id: data.user.id,
        email: cleanEmail,
        name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
        companyName: data.user.user_metadata?.company_name || 'SIDIAL FERRAGENS',
        role: 'client',
        isMaster: false,
        createdAt: data.user.created_at,
      };

      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    }

    // 3. Client login fallback for offline/demo
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0].toUpperCase(),
      companyName: 'SIDIAL FERRAGENS',
      role: 'client',
      isMaster: false,
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
        const authUser: AuthUser = {
          id: data.user.id,
          email: cleanEmail,
          name,
          companyName,
          role: 'client',
          isMaster: false,
          createdAt: data.user.created_at,
        };
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      }
      return { success: true };
    }

    // Offline registration simulation
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      name,
      companyName,
      role: 'client',
      isMaster: false,
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

    // Google Login simulation
    const authUser: AuthUser = {
      id: 'google-user-1',
      email: 'usuario.gmail@gmail.com',
      name: 'Usuário Google',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      companyName: 'Minha Empresa Google',
      role: 'client',
      isMaster: false,
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
    loginAsDemo();
  };

  // Role Switcher
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
