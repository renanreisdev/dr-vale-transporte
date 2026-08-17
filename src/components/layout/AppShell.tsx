'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import DemoBanner from './DemoBanner';
import { useVTStore } from '@/lib/store';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { period, company, license, refreshLicense, isLoaded } = useVTStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const isPublicRoute = pathname === '/login' || pathname === '/cadastro';

  // Protect internal routes: redirect to /login if unauthenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoading, isPublicRoute, router]);

  // If on public login or register pages, render directly without sidebar/header
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Loading state
  if (!isLoaded || isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Autenticando no DR VALE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        companyName={company.tradeName || company.name || period.companyName}
        isLicensed={license?.isLicensed}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DemoBanner
          license={license}
          onRefreshLicense={refreshLicense}
          companyName={company.tradeName || company.name || period.companyName}
        />
        <Header
          period={period}
          companyName={company.tradeName || company.name || period.companyName}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShellContent>{children}</ShellContent>
    </AuthProvider>
  );
}
