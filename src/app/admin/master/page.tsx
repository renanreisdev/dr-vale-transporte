'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useMasterStore } from '@/lib/master-store';
import MasterMetricsOverview from '@/components/master/MasterMetricsOverview';
import MasterLicenseManager from '@/components/master/MasterLicenseManager';
import MasterUserManager from '@/components/master/MasterUserManager';
import MasterAdminTeam from '@/components/master/MasterAdminTeam';
import MasterPricingManager from '@/components/master/MasterPricingManager';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Users,
  DollarSign,
  Lock,
  UserPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function MasterDashboardPage() {
  const { user, isMaster, switchRoleForDev } = useAuth();
  const {
    licenses,
    masterAdmins,
    clients,
    pricingConfig,
    metrics,
    addLicense,
    updateClientAndPlan,
    extendLicense,
    toggleLicenseStatus,
    deleteLicense,
    addMasterAdmin,
    removeMasterAdmin,
    updatePricing,
  } = useMasterStore();

  const [activeTab, setActiveTab] = useState<'licenses' | 'clients' | 'admins' | 'pricing'>('licenses');
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPassError(null);

    try {
      const res = await fetch('/api/auth/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (data.success) {
        switchRoleForDev('master');
        setPasscode('');
      } else {
        setPassError(data.message || 'Senha Master incorreta.');
      }
    } catch {
      setPassError('Erro ao validar senha master no servidor.');
    } finally {
      setIsVerifying(false);
    }
  };

  // If not master, display secure unlock gatekeeper
  if (!isMaster) {
    return (
      <div className="max-w-md mx-auto my-12 rounded-2xl bg-white p-7 shadow-xl border border-slate-200 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Acesso Restrito ao Usuário Master</h2>
          <p className="text-xs text-slate-500 mt-1">
            Esta área é exclusiva para o dono do sistema gerenciar licenças, faturamento e usuários.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3 pt-2">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Digite a Senha Master..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-center font-medium focus:border-indigo-600 focus:outline-none"
              required
            />
            {passError && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{passError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{isVerifying ? 'Verificando...' : 'Desbloquear Painel Master'}</span>
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
      {/* Master Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xs border border-indigo-900/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/30 px-2 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-400/40">
              PAINEL DO DONO (MASTER)
            </span>
            <span className="text-xs text-slate-400 font-mono">Master: {user?.email}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
            Central de Controle de Licenças & Clientes
          </h1>
          <p className="text-xs text-indigo-200/80 max-w-2xl mt-1">
            Emissão de licenças, controle de prazos, faturamento e gestão de administradores do SaaS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRoleForDev('client')}
            className="rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition"
          >
            Visualizar como Cliente
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MasterMetricsOverview metrics={metrics} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('licenses')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'licenses'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>Gestão de Licenças & Assinaturas ({licenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'clients'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Clientes & Empresas ({clients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'admins'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          <span>Administradores Master ({masterAdmins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'pricing'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Planos & Valores (Pricing)</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'licenses' && (
        <MasterLicenseManager
          licenses={licenses}
          onAddLicense={addLicense}
          onExtendLicense={extendLicense}
          onToggleStatus={toggleLicenseStatus}
          onDeleteLicense={deleteLicense}
        />
      )}

      {activeTab === 'clients' && (
        <MasterUserManager
          clients={clients}
          onUpdateClientAndPlan={updateClientAndPlan}
        />
      )}

      {activeTab === 'admins' && (
        <MasterAdminTeam
          masterAdmins={masterAdmins}
          onAddMasterAdmin={addMasterAdmin}
          onRemoveMasterAdmin={removeMasterAdmin}
        />
      )}

      {activeTab === 'pricing' && (
        <MasterPricingManager
          pricingConfig={pricingConfig}
          onUpdatePricing={updatePricing}
        />
      )}
    </div>
  );
}
