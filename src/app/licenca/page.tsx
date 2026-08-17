'use client';

import React, { useState } from 'react';
import { useVTStore } from '@/lib/store';
import KeyGeneratorCard from '@/components/licenca/KeyGeneratorCard';
import ActivationModal from '@/components/licenca/ActivationModal';
import { extendTrialDays, removeLicense } from '@/lib/license-service';
import {
  KeyRound,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Zap,
} from 'lucide-react';

export default function LicencaPage() {
  const { license, company, refreshLicense } = useVTStore();
  const [isActivationOpen, setIsActivationOpen] = useState(false);

  const isTrial = license?.isTrial;
  const isLicensed = license?.isLicensed;
  const daysLeft = license?.trialDaysRemaining || 0;

  const handleExtendTrial = () => {
    extendTrialDays(7);
    refreshLicense();
  };

  const handleResetLicense = () => {
    if (confirm('Deseja redefinir a licença de volta para o modo Trial de avaliação?')) {
      removeLicense();
      refreshLicense();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-xs border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Gestão de Licenciamento & Demonstração
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Status da Licença Comercial DR VALE
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Controle de período de teste para clientes, ativação de chaves seriais e gerador administrativo de licenças.
          </p>
        </div>

        <button
          onClick={() => setIsActivationOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition"
        >
          <KeyRound className="h-4 w-4" />
          <span>Ativar Chave Serial</span>
        </button>
      </div>

      {/* Current License Status Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isLicensed
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}
            >
              {isLicensed ? <ShieldCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {isTrial
                    ? daysLeft > 0
                      ? 'Período de Demonstração Ativo (Trial)'
                      : 'Período de Demonstração Expirado'
                    : 'Licença Comercial Oficial Ativada'}
                </h2>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                    isLicensed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {license?.licenseType}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Licenciado para: <strong className="text-slate-800">{license?.licensedTo || company.tradeName || company.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTrial && (
              <button
                onClick={handleExtendTrial}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition shadow-2xs"
              >
                +7 Dias no Trial
              </button>
            )}
            {!isTrial && (
              <button
                onClick={handleResetLicense}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Voltar ao Trial</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
            <span className="text-slate-500 font-medium">Dias Restantes no Período:</span>
            <p className="text-base font-bold text-slate-900 mt-1">
              {isTrial ? `${daysLeft} dias` : 'Vitalício / Ilimitado'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
            <span className="text-slate-500 font-medium">Exportação PDF & Excel:</span>
            <p className="text-base font-bold text-emerald-700 mt-1">
              {license?.features.exportPdf ? 'Habilitado (Oficial)' : 'Bloqueado / Marca d`água'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
            <span className="text-slate-500 font-medium">Limite de Colaboradores:</span>
            <p className="text-base font-bold text-slate-900 mt-1">Ilimitado</p>
          </div>
        </div>
      </div>

      {/* Commercial Plans & Purchase Cards */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Planos e Aquisição Comercial para Clientes</h2>
          <p className="text-xs text-slate-500">Ofereça aos seus clientes o plano ideal para a empresa deles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Mensal */}
          <div className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assinatura Mensal</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">R$ 49</span>
                <span className="text-xs text-slate-500">/mês</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Ideal para pequenas empresas e apuração pontual de VT.</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cálculos ilimitados de colaboradores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Relatórios em PDF e Excel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Suporte por e-mail e WhatsApp</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5553991226768?text=Gostaria%20de%20assinar%20o%20Plano%20Mensal%20do%20DR%20VALE"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition shadow-xs"
            >
              <span>Contratar Mensal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Anual (Destaque) */}
          <div className="relative rounded-xl border-2 border-emerald-600 p-5 bg-emerald-50/20 flex flex-col justify-between shadow-xs">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              MAIS POPULAR (ECONOMIZE 35%)
            </span>
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Plano Anual</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-950">R$ 380</span>
                <span className="text-xs text-slate-500">/ano</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Para escritórios contábeis e RHs que fecham folha todo mês.</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Multi-empresa e multi-período</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Geração de Recibos com Assinatura</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Guia CLT & Termos Jurídicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5553991226768?text=Gostaria%20de%20assinar%20o%20Plano%20Anual%20do%20DR%20VALE"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-1.5 w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition shadow-xs"
            >
              <span>Contratar Anual</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Vitalício */}
          <div className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Licença Vitalícia</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">R$ 790</span>
                <span className="text-xs text-slate-500">taxa única</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Pagamento único para acesso definitivo sem mensalidades.</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Acesso vitalício sem expiração</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Atualizações de segurança incluídas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Chave serial permanente</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/5553991226768?text=Gostaria%20de%20comprar%20a%20Licen%C3%A7a%20Vital%C3%ADcia%20do%20DR%20VALE"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition shadow-xs"
            >
              <span>Comprar Vitalício</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Admin Key Generator Component */}
      <KeyGeneratorCard />

      <ActivationModal
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
        onActivated={() => {
          setIsActivationOpen(false);
          refreshLicense();
        }}
        companyName={company.tradeName || company.name}
      />
    </div>
  );
}
