'use client';

import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Sparkles, X, ShieldCheck } from 'lucide-react';
import { activateLicense } from '@/lib/license-service';
import confetti from 'canvas-confetti';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated: () => void;
  companyName?: string;
}

export default function ActivationModal({
  isOpen,
  onClose,
  onActivated,
  companyName = 'SIDIAL FERRAGENS',
}: ActivationModalProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<any>(null);

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = activateLicense(licenseKey);
    if (!res.success) {
      setError(res.message);
      return;
    }

    setSuccess(true);
    setLicenseInfo(res.license);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onActivated();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Ativar Licença DR VALE</h3>
            <p className="text-xs text-slate-500">Desbloqueie todos os recursos comerciais e emissões ilimitadas</p>
          </div>
        </div>

        {success ? (
          <div className="my-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
            <h4 className="text-sm font-semibold text-emerald-900">Licença Ativada com Sucesso!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Tipo: <span className="font-semibold uppercase">{licenseInfo?.type}</span> • Licenciado para:{' '}
              <span className="font-semibold">{licenseInfo?.licensedTo || companyName}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Chave de Licença (Serial Key)
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="DRVALE-LIF-SIDIAL-LIFETIME-XXXXXX"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono tracking-wider uppercase placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Insira a chave fornecida pelo suporte comercial ou gerada no painel administrativo.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Garantias da Versão Oficial DR VALE:</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>Exportação de relatórios em PDF sem marca d'água</li>
                <li>Importação e exportação contínua de planilhas Excel</li>
                <li>Conformidade jurídica com Art. 455 da CLT e Lei 7.418/85</li>
                <li>Suporte técnico prioritário direto via WhatsApp</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Validar e Ativar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
