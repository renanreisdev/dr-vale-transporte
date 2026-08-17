'use client';

import React, { useState } from 'react';
import { useVTStore } from '@/lib/store';
import { isSupabaseConfigured, syncPeriodToSupabase } from '@/lib/supabase';
import {
  Building2,
  Database,
  Save,
  CheckCircle2,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const { company, period, rows, updateCompany } = useVTStore();
  const [formData, setFormData] = useState({ ...company });
  const [supabaseUrl, setSupabaseUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      company: formData,
      period,
      rows,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_DR_VALE_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncCloud = async () => {
    setSyncStatus('Sincronizando com nuvem Supabase...');
    const res = await syncPeriodToSupabase(period, rows);
    setSyncStatus(res.message);
    setTimeout(() => setSyncStatus(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Configurações Gerais da Empresa</h1>
            <p className="text-xs text-slate-500">
              Dados cadastrais exibidos nos relatórios oficiais, recibos e parâmetros de nuvem
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <form onSubmit={handleSaveCompany} className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Identificação Cadastral
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Razão Social</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs uppercase font-medium focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome Fantasia (Exibição)</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs uppercase font-medium focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">CNPJ</label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono font-medium focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Telefone / Contato</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(53) 99122-6768"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Responsável de RH / DP</label>
              <input
                type="text"
                value={formData.responsibleName}
                onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                placeholder="Ex: Reis"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Cargo do Responsável</label>
              <input
                type="text"
                value={formData.responsibleRole}
                onChange={(e) => setFormData({ ...formData, responsibleRole: e.target.value })}
                placeholder="Ex: Gestor de Recursos Humanos"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            {savedSuccess ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Dados da empresa salvos com sucesso!</span>
              </div>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Cloud Sync Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Banco de Dados em Nuvem (Supabase)</h2>
              <p className="text-xs text-slate-500">
                Status: {isSupabaseConfigured ? 'Conectado à Nuvem' : 'Operando em Modo Local (Offline/LocalStorage)'}
              </p>
            </div>
          </div>

          {isSupabaseConfigured && (
            <button
              onClick={handleSyncCloud}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
              <span>Sincronizar Agora</span>
            </button>
          )}
        </div>

        {syncStatus && (
          <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-800 border border-slate-200">
            {syncStatus}
          </div>
        )}

        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Persistência Híbrida & Segura:</span>
          </div>
          <p className="leading-relaxed">
            A aplicação salva instantaneamente todos os cálculos e dados no armazenamento local do navegador
            (Local-First). Para habilitar backup multi-dispositivo em nuvem, adicione as chaves no arquivo{' '}
            <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[11px]">.env.local</code> e execute a migração contida em{' '}
            <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[11px]">supabase/schema.sql</code>.
          </p>
        </div>
      </div>

      {/* Backup & Restore Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Backup de Segurança dos Dados</h2>
          <p className="text-xs text-slate-500">
            Exporte uma cópia completa de todos os colaboradores e cálculos em formato JSON
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <Download className="h-4 w-4 text-emerald-600" />
          <span>Baixar Backup JSON</span>
        </button>
      </div>
    </div>
  );
}
