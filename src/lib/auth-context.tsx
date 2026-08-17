'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '@/types/auth';
import { supabase, isSupabaseConfigured } from './supabase';
import { generateLicenseKey } from './license-service';

const AUTH_STORAGE_KEY = 'dr_vale_auth_session_v1';
const MASTER_PRICING_KEY = 'dr_vale_master_pricing_v1';

interface CompanyOnboardingData {
  name: string;
  tradeName: string;
  cnpj: string;
  phone: string;
  city: string;
  state: string;
  responsibleName: string;
  responsibleRole: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isMaster: boolean;
  isDemo: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; isMaster: boolean; isProfileComplete: boolean; message?: string }>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string
  ) => Promise<{ success: boolean; requiresEmailVerification?: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; isMaster: boolean; isProfileComplete: boolean; message?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (newPass: string) => Promise<{ success: boolean; message?: string }>;
  completeOnboarding: (companyData: CompanyOnboardingData) => void;
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
            
            const savedRaw = localStorage.getItem(AUTH_STORAGE_KEY);
            const savedParsed = savedRaw ? JSON.parse(savedRaw) : null;
            const isProfileComplete = isMaster || (savedParsed ? !!savedParsed.isProfileComplete : false);

            const authUser: AuthUser = {
              id: sbUser.id,
              email,
              name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0],
              avatarUrl: sbUser.user_metadata?.avatar_url,
              companyName: sbUser.user_metadata?.company_name || savedParsed?.companyName || '',
              role: isMaster ? 'master' : 'client',
              isMaster,
              isProfileComplete,
              emailVerified: !!sbUser.email_confirmed_at,
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
          setUser(null);
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
          const masterUser: AuthUser = {
            ...masterData.user,
            isProfileComplete: true,
          };
          setUser(masterUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(masterUser));
          return { success: true, isMaster: true, isProfileComplete: true };
        }
      }
    } catch {
      // fallback
    }

    // 2. Check Supabase auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return { success: false, isMaster: false, isProfileComplete: false, message: error.message };
      }

      const isMaster = cleanEmail === 'renanreis.dev@gmail.com';
      const savedRaw = localStorage.getItem(AUTH_STORAGE_KEY);
      const savedParsed = savedRaw ? JSON.parse(savedRaw) : null;
      const isProfileComplete = isMaster || (savedParsed ? !!savedParsed.isProfileComplete : false);

      const authUser: AuthUser = {
        id: data.user.id,
        email: cleanEmail,
        name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
        companyName: data.user.user_metadata?.company_name || savedParsed?.companyName || '',
        role: isMaster ? 'master' : 'client',
        isMaster,
        isProfileComplete,
        emailVerified: !!data.user.email_confirmed_at,
        createdAt: data.user.created_at,
      };

      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      return { success: true, isMaster, isProfileComplete };
    }

    // 3. Client login fallback for offline
    const savedRaw = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedParsed = savedRaw ? JSON.parse(savedRaw) : null;
    const isProfileComplete = savedParsed?.email === cleanEmail ? !!savedParsed.isProfileComplete : false;

    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0].toUpperCase(),
      companyName: savedParsed?.companyName || '',
      role: 'client',
      isMaster: false,
      isProfileComplete,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true, isMaster: false, isProfileComplete };
  };

  // Register with Email
  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: name,
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
          companyName: '',
          role: 'client',
          isMaster: false,
          isProfileComplete: false,
          emailVerified: !!data.user.email_confirmed_at,
          createdAt: data.user.created_at,
        };
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      }
      return { success: true, requiresEmailVerification: true };
    }

    // Offline registration
    const authUser: AuthUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      name,
      companyName: '',
      role: 'client',
      isMaster: false,
      isProfileComplete: false,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true, requiresEmailVerification: false };
  };

  // 1-Click Fast Login / Signup with Google (Gmail)
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) return { success: false, isMaster: false, isProfileComplete: false, message: error.message };
      return { success: true, isMaster: false, isProfileComplete: false };
    }

    // Direct Google authentication simulation
    const savedRaw = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedParsed = savedRaw ? JSON.parse(savedRaw) : null;
    const isProfileComplete = savedParsed ? !!savedParsed.isProfileComplete : false;

    const authUser: AuthUser = {
      id: 'google-user-' + Date.now(),
      email: 'usuario.gmail@gmail.com',
      name: 'Usuário Google',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      companyName: savedParsed?.companyName || '',
      role: 'client',
      isMaster: false,
      isProfileComplete,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return { success: true, isMaster: false, isProfileComplete };
  };

  // Send Password Reset Link to Email
  const sendPasswordReset = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/redefinir-senha` : undefined,
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    }

    // Offline simulation
    return { success: true, message: 'Link de redefinição de senha enviado para seu e-mail!' };
  };

  // Update / Reset Password
  const updatePassword = async (newPass: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({
        password: newPass,
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    }

    return { success: true };
  };

  // Complete First Login Onboarding (Company Setup + Dynamic Trial Duration from Master Pricing)
  const completeOnboarding = (companyData: CompanyOnboardingData) => {
    if (!user) return;

    let trialDays = 14;
    try {
      const savedPricing = localStorage.getItem(MASTER_PRICING_KEY);
      if (savedPricing) {
        const parsedPricing = JSON.parse(savedPricing);
        if (parsedPricing.trialDurationDays && Number(parsedPricing.trialDurationDays) > 0) {
          trialDays = Number(parsedPricing.trialDurationDays);
        }
      }
    } catch (e) {
      console.error('Error reading master pricing:', e);
    }

    const expDate = new Date(Date.now() + trialDays * 86400000);
    const expDateStr = expDate.toISOString().slice(0, 10);
    const generatedKey = generateLicenseKey('T30', companyData.name, expDateStr);

    const trialLicense = {
      isLicensed: true,
      licenseKey: generatedKey,
      planType: 'trial',
      clientName: companyData.name.toUpperCase(),
      expirationDate: expDate.toISOString(),
      daysRemaining: trialDays,
      isTrial: true,
      maxEmployees: 50,
      activatedAt: new Date().toISOString(),
    };

    localStorage.setItem('dr_vale_company_settings_v1', JSON.stringify({
      name: companyData.name.toUpperCase(),
      tradeName: companyData.tradeName.toUpperCase(),
      cnpj: companyData.cnpj,
      phone: companyData.phone,
      city: companyData.city,
      state: companyData.state.toUpperCase(),
      responsibleName: companyData.responsibleName,
      responsibleRole: companyData.responsibleRole,
    }));
    localStorage.setItem('dr_vale_license_v1', JSON.stringify(trialLicense));

    const updatedUser: AuthUser = {
      ...user,
      companyName: companyData.name.toUpperCase(),
      isProfileComplete: true,
    };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  // Dev Role Switcher
  const switchRoleForDev = (role: UserRole) => {
    if (!user) {
      const newUser: AuthUser = {
        id: 'dev-user',
        email: role === 'master' ? 'renanreis.dev@gmail.com' : 'cliente@empresa.com.br',
        name: role === 'master' ? 'Renan Reis (Master)' : 'Cliente',
        companyName: 'SIDIAL FERRAGENS',
        role,
        isMaster: role === 'master',
        isProfileComplete: true,
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return;
    }

    const updated: AuthUser = {
      ...user,
      role,
      isMaster: role === 'master',
      isProfileComplete: true,
    };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isMaster: !!user?.isMaster,
        isDemo: user?.role === 'demo',
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        updatePassword,
        completeOnboarding,
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
