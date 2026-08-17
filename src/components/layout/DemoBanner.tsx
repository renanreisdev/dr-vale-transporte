'use client';

import React, { useState } from 'react';
import { Sparkles, Clock, AlertTriangle, ShieldCheck, KeyRound } from 'lucide-react';
import { LicenseStatus } from '@/types/vt';
import ActivationModal from '../licenca/ActivationModal';

interface DemoBannerProps {
  license: LicenseStatus | null;
  onRefreshLicense: () => void;
  companyName?: string;
}

export default function DemoBanner({ license, onRefreshLicense, companyName }: DemoBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!license) return null;

  // If permanently licensed, show a subtle active badge or nothing intrusive
  if (!license.isTrial && license.isLicensed) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            Licença Oficial Ativa: <strong className="text-white font-medium">{license.licensedTo || companyName || 'SIDIAL FERRAGENS'}</strong>
          </span>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">
            {license.licenseType}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Suporte: (53) 99122-6768
        </div>
      </div>
    );
  }

  const isExpired = license.trialDaysRemaining <= 0;

  return (
    <>
      <div
        className={`px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b no-print ${
          isExpired
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isExpired ? (
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          ) : (
            <Clock className="h-4 w-4 text-amber-600 shrink-0" />
          )}
          <div>
            <span className="font-semibold">
              {isExpired ? 'Período de Demonstração Expirado' : 'Modo de Demonstração (Trial Ativo)'}
            </span>
            <span className="mx-1.5 opacity-60">•</span>
            <span className="text-[11px]">
              {isExpired
                ? 'Seu período de avaliação de 14 dias terminou. Ative uma chave para continuar exportando relatórios sem restrições.'
                : `Você possui ${license.trialDaysRemaining} dia(s) restante(s) de teste gratuito com todas as funcionalidades.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Ativar Licença
          </button>
        </div>
      </div>

      <ActivationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onActivated={() => {
          setIsModalOpen(false);
          onRefreshLicense();
        }}
        companyName={companyName}
      />
    </>
  );
}
