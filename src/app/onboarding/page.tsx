'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useVTStore } from '@/lib/store';
import {
  Building2,
  Bus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Phone,
  MapPin,
  User,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuth();
  const { refreshLicense } = useVTStore();

  const [trialDays, setTrialDays] = useState(14);
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('RS');
  const [responsibleName, setResponsibleName] = useState(user?.name || '');
  const [responsibleRole, setResponsibleRole] = useState('Gestor de RH / DP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read master trial duration configuration
  useEffect(() => {
    try {
      const savedPricing = localStorage.getItem('dr_vale_master_pricing_v1');
      if (savedPricing) {
        const parsed = JSON.parse(savedPricing);
        if (parsed.trialDurationDays && Number(parsed.trialDurationDays) > 0) {
          setTrialDays(Number(parsed.trialDurationDays));
        }
      }
    } catch (e) {
      console.error('Error reading trial days:', e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cnpj.trim()) return;

    setIsSubmitting(true);

    completeOnboarding({
      name,
      tradeName: tradeName || name,
      cnpj,
      phone,
      city,
      state,
      responsibleName,
      responsibleRole,
    });

    refreshLicense();

    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Bus className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200 uppercase">
              Primeiro Acesso • Ativação de Teste
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Bem-vindo ao DR VALE!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Cadastre os dados da sua empresa para ativar sua licença gratuita de{' '}
            <strong className="text-emerald-700 font-bold">{trialDays} dias</strong> e iniciar seus cálculos
            conforme a CLT.
          </p>
        </div>

        {/* Onboarding Form Box */}
        <div className="rounded-2xl bg-white p-7 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Identificação Cadastral da Empresa</h2>
              <p className="text-xs text-slate-500">Dados oficiais que constarão no relatório e recibos</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razão Social */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Razão Social da Empresa *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: SILVA & SOUZA COMÉRCIO DE ALIMENTOS LTDA"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold uppercase text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Nome Fantasia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nome Fantasia (Exibição) *
                </label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="Ex: MERCADO CENTRAL"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold uppercase text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* CNPJ */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  CNPJ da Empresa *
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* WhatsApp / Telefone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  WhatsApp / Telefone de Contato *
                </label>
                <div className="relative flex items-center">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(53) 99999-9999"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Cidade / UF */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cidade *</label>
                  <div className="relative flex items-center">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Pelotas"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">UF *</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="RS"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm uppercase font-bold text-center text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Responsável RH */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nome do Responsável pelo RH / DP *
                </label>
                <div className="relative flex items-center">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    placeholder="Ex: Maria Fernandes"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cargo do Responsável
                </label>
                <input
                  type="text"
                  value={responsibleRole}
                  onChange={(e) => setResponsibleRole(e.target.value)}
                  placeholder="Ex: Analista de Recursos Humanos"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Legal Lock Notice */}
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <Lock className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Aviso de Bloqueio Fiscal e Emissão de Licença:</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Os dados de <strong>Razão Social</strong> e <strong>CNPJ</strong> ficarão vinculados à sua licença
                  oficial de teste e não poderão ser alterados diretamente no painel, podendo ser alterados apenas
                  mediante solicitação ao Administrador Master.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? 'Ativando Licença...'
                  : `Ativar Licença Grátis de ${trialDays} Dias & Iniciar`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          DR VALE • Gestão Conforme Art. 455 da CLT
        </div>
      </div>
    </div>
  );
}
