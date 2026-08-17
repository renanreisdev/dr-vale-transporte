'use client';

import React from 'react';
import { MasterMetrics } from '@/types/master';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  Users,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface MasterMetricsOverviewProps {
  metrics: MasterMetrics;
}

export default function MasterMetricsOverview({ metrics }: MasterMetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Faturamento Total
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black tracking-tight text-emerald-700">
            {formatCurrencyBRL(metrics.totalRevenue)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Receita acumulada de licenças vendidas</p>
        </div>
      </div>

      {/* MRR */}
      <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            MRR Estimado
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black tracking-tight text-slate-900">
            {formatCurrencyBRL(metrics.monthlyRecurringRevenue)} <span className="text-xs font-normal text-slate-500">/mês</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Receita recorrente de planos mensais/anuais</p>
        </div>
      </div>

      {/* Active Licenses */}
      <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Licenças Ativas
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black tracking-tight text-indigo-950">
            {metrics.activeLicensesCount} <span className="text-xs font-normal text-slate-500">empresas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Clientes com acesso liberado</p>
        </div>
      </div>

      {/* Trial Leads */}
      <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Leads em Teste (Trial)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black tracking-tight text-amber-900">
            {metrics.trialClientsCount} <span className="text-xs font-normal text-slate-500">avaliações</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Oportunidades ativas para conversão</p>
        </div>
      </div>
    </div>
  );
}
