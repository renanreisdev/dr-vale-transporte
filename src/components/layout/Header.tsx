'use client';

import React, { useState } from 'react';
import { VTPeriod } from '@/types/vt';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  DollarSign,
  Building2,
  User,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  period: VTPeriod;
  companyName?: string;
  onSave?: () => void;
}

export default function Header({ period, companyName = 'SIDIAL FERRAGENS', onSave }: HeaderProps) {
  const router = useRouter();
  const { user, isMaster, isDemo, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-6 shadow-xs no-print">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <h1 className="text-sm font-semibold text-slate-900">{companyName}</h1>
          </div>
          <p className="text-xs text-slate-500">Sistema Oficial de Cálculo de Vale Transporte</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Period Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700 border border-slate-200">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold">{period.month}</span>
          <span className="text-slate-400">|</span>
          <span>
            {period.startDate} a {period.endDate} ({period.sundaysAndHolidays} dom/fer)
          </span>
        </div>

        {/* Unit Tariff Badge */}
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 border border-emerald-200">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          <span>Passe:</span>
          <strong className="font-semibold">{formatCurrencyBRL(period.unitPrice)}</strong>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs transition shadow-2xs"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-[10px]">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="text-left hidden md:block max-w-[120px] truncate">
              <p className="text-xs font-semibold text-slate-900 truncate leading-none">
                {user?.name || 'Usuário'}
              </p>
              <span className="text-[10px] text-slate-500 truncate leading-none">
                {isMaster ? 'Dono (Master)' : isDemo ? 'Demonstração' : 'Cliente'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-lg mb-1">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  {isMaster ? (
                    <span className="rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.5 border border-indigo-200">
                      MASTER / DONO DO SISTEMA
                    </span>
                  ) : isDemo ? (
                    <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 border border-amber-200">
                      MODO DEMONSTRAÇÃO (TRIAL)
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 border border-emerald-200">
                      CLIENTE LICENCIADO
                    </span>
                  )}
                </div>
              </div>

              {isMaster && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push('/admin/licencas');
                  }}
                  className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Acessar Painel Master (Admin)</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  router.push('/login');
                }}
                className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition"
              >
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Trocar de Conta / Login</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sair da Sessão</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
