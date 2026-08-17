'use client';

import React, { useState } from 'react';
import { useVTStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
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
  Lock,
  MessageSquare,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const { company, period, rows, updateCompany } = useVTStore();
  const { isMaster } = useAuth();

  const [formData, setFormData] = useState({ ...company });
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

  const getWhatsAppRequestUrl = () => {
    const msg = encodeURIComponent(
      `Olá Suporte DR VALE! Gostaria de solicitar a alteração dos dados fiscais cadastrados da minha empresa:\n\n` +
      `🏢 Empresa Atual: ${company.tradeName || company.name}\n` +
      `📄 CNPJ Atual: ${company.cnpj || 'Não informado'}\n` +
      `📝 Novos dados a atualizar: `
    );
    return `https://wa.me/5553991226768?text=${msg}`;
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
              Dados cadastrais exibidos nos relatórios oficiais, recibos e parâmetros fiscais
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <form onSubmit={handleSaveCompany} className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Identificação Cadastral & Fiscal
            </h2>
            {isMaster ? (
              <span className="rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 border border-indigo-200">
                Acesso Master: Edição Fiscal Liberada
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 border border-slate-200">
                <Lock className="h-3 w-3 text-slate-500" />
                Dados Fiscais Travados para o Cliente
              </span>
            )}
          </div>

          {/* Locked Notice for Clients */}
          {!isMaster && (
            <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-start gap-2.5 max-w-xl">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Razão Social, Nome Fantasia e CNPJ são bloqueados:</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Por conformidade com o Art. 455 da CLT e emissão oficial de licença, os dados fiscais da empresa não podem
                    ser alterados diretamente pelo cliente. Caso necessite atualizar, solicite ao suporte Master.
                  </p>
                </div>
              </div>

              <a
                href={getWhatsAppRequestUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-2xs shrink-0"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Solicitar Alteração</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Razão Social */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">Razão Social</label>
                {!isMaster && <Lock className="h-3 w-3 text-slate-400" />}
              </div>
              <input
                type="text"
                value={formData.name}
                disabled={!isMaster}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs uppercase font-medium focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Nome Fantasia */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">Nome Fantasia (Exibição)</label>
                {!isMaster && <Lock className="h-3 w-3 text-slate-400" />}
              </div>
              <input
                type="text"
                value={formData.tradeName}
                disabled={!isMaster}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs uppercase font-medium focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* CNPJ */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">CNPJ da Empresa</label>
                {!isMaster && <Lock className="h-3 w-3 text-slate-400" />}
              </div>
              <input
                type="text"
                value={formData.cnpj}
                disabled={!isMaster}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono font-medium focus:border-emerald-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
              />
            </div>

            {/* Telefone */}
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

            {/* Endereço */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Endereço Comercial</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, Número, Bairro"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Cidade / UF */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Cidade</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Pelotas"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  placeholder="RS"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs uppercase text-center focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Responsável RH */}
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

            {/* Cargo */}
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

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            {savedSuccess ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Dados salvos com sucesso!</span>
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

      {/* Backup Card */}
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
