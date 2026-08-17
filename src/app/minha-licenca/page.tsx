'use client';

import React, { useState } from 'react';
import { useVTStore } from '@/lib/store';
import ActivationModal from '@/components/licenca/ActivationModal';
import {
  KeyRound,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  FileCheck,
} from 'lucide-react';

export default function MinhaLicencaPage() {
  const { license, company, refreshLicense } = useVTStore();
  const [isActivationOpen, setIsActivationOpen] = useState(false);

  const isTrial = license?.isTrial;
  const isLicensed = license?.isLicensed;
  const daysLeft = license?.trialDaysRemaining || 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-xs border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Minha Assinatura & Licença
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Status da Licença da Empresa
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Consulte a validade de uso do DR VALE e ative a chave serial fornecida pelo suporte comercial.
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

      {/* Status Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                isLicensed
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}
            >
              {isLicensed ? <ShieldCheck className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {isTrial
                    ? daysLeft > 0
                      ? 'Período de Demonstração (Trial Grátis)'
                      : 'Período de Demonstração Expirado'
                    : 'Licença Comercial Ativa'}
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
                Empresa Licenciada: <strong className="text-slate-800">{license?.licensedTo || company.tradeName || company.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-slate-500 font-medium">Dias Restantes de Teste:</span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {isTrial ? `${daysLeft} dias` : 'Ilimitado / Vitalício'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-slate-500 font-medium">Exportação Oficial em PDF:</span>
            <p className="text-lg font-bold text-emerald-700 mt-1">
              {license?.features.exportPdf ? 'Liberada' : 'Bloqueada'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-slate-500 font-medium">Recibos com Assinatura:</span>
            <p className="text-lg font-bold text-slate-900 mt-1">Habilitados</p>
          </div>
        </div>
      </div>

      {/* Support & Upgrade Card */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Precisa Renovar ou Adquirir sua Licença?</h3>
            <p className="text-xs text-slate-500">Fale diretamente com nossa equipe comercial e receba sua chave serial</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-950">Atendimento Direto pelo WhatsApp</p>
            <p className="text-xs text-emerald-800">
              Contato: <strong className="font-bold">(53) 99122-6768</strong> (Reis) • Segunda a Sexta
            </p>
          </div>

          <a
            href="https://wa.me/5553991226768?text=Ol%C3%A1%2C%20gostaria%20de%20adquirir%20uma%20chave%20de%20licen%C3%A7a%20do%20DR%20VALE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
          >
            <span>Falar no WhatsApp</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

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
