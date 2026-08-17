'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useVTStore } from '@/lib/store';
import KeyGeneratorCard from '@/components/licenca/KeyGeneratorCard';
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Users,
  DollarSign,
  Lock,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLicencasPage() {
  const { user, isMaster, switchRoleForDev } = useAuth();
  const { license, refreshLicense } = useVTStore();
  const [masterPasscode, setMasterPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  const handleUnlockMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPasscode === 'master2026' || masterPasscode === 'admin123' || masterPasscode === 'renan') {
      switchRoleForDev('master');
      setPassError(false);
      setMasterPasscode('');
    } else {
      setPassError(true);
    }
  };

  // If not master, show master login gate
  if (!isMaster) {
    return (
      <div className="max-w-md mx-auto my-12 rounded-2xl bg-white p-7 shadow-xl border border-slate-200 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Acesso Restrito ao Usuário Master</h2>
          <p className="text-xs text-slate-500 mt-1">
            Esta área é exclusiva para o proprietário do SaaS (geração de seriais e gestão comercial).
          </p>
        </div>

        <form onSubmit={handleUnlockMaster} className="space-y-3 pt-2">
          <div>
            <input
              type="password"
              value={masterPasscode}
              onChange={(e) => setMasterPasscode(e.target.value)}
              placeholder="Digite a Senha Master..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-center font-medium focus:border-indigo-600 focus:outline-none"
              required
            />
            {passError && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                Senha Master incorreta. Dica: master2026
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Desbloquear Painel Master</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-700">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-xs border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              Painel do Dono do SaaS
            </span>
            <span className="text-xs text-slate-400 font-mono">Master: {user?.email}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Central de Licenciamento Master
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Gere seriais comerciais para seus clientes, controle planos ativos e configure licenças do DR VALE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRoleForDev('client')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition"
            title="Alternar para visualização de cliente comum"
          >
            <span>Ver como Cliente</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total de Licenças Geráveis</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">Ilimitado</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Assinadas localmente com hash SHA</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Planos Disponíveis</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">4 Modelos</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Demo 30d, Mensal, Anual, Vitalício</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Status da Conta Master</span>
          <div className="flex items-center gap-1.5 mt-1 text-emerald-700 font-bold text-base">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Administrador Autenticado</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Acesso irrestrito a todas as funções</p>
        </div>
      </div>

      {/* Admin Key Generator Component */}
      <KeyGeneratorCard />
    </div>
  );
}
