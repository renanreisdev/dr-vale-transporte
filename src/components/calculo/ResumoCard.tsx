'use client';

import React from 'react';
import { CalculationResult, formatCurrencyBRL } from '@/lib/vt-engine';
import { DollarSign, Ticket, Users, TrendingUp, Plus, FileSpreadsheet, Printer } from 'lucide-react';
import Link from 'next/link';

interface ResumoCardProps {
  summary: CalculationResult;
  onAddRow: () => void;
  onOpenImportExport: () => void;
}

export default function ResumoCard({ summary, onAddRow, onOpenImportExport }: ResumoCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total a Creditar */}
      <div className="rounded-xl bg-white p-4.5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Valor Total da Empresa</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-emerald-700">
            {formatCurrencyBRL(summary.totalAmountCompany)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Total líquido a depositar/creditar</p>
        </div>
      </div>

      {/* Total de Vales */}
      <div className="rounded-xl bg-white p-4.5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Quantidade Total de Vales</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 border border-blue-200">
            <Ticket className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {summary.totalVouchersCompany} <span className="text-sm font-normal text-slate-500">un.</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Dias úteis + sábados somados</p>
        </div>
      </div>

      {/* Colaboradores Ativos */}
      <div className="rounded-xl bg-white p-4.5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Colaboradores no Período</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {summary.totalEmployeesActive} <span className="text-sm font-normal text-slate-500">pessoas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Beneficiários cadastrados</p>
        </div>
      </div>

      {/* Custo Médio */}
      <div className="rounded-xl bg-white p-4.5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Média por Colaborador</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-200">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrencyBRL(summary.averageAmountPerEmployee)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Custo médio individual</p>
        </div>
      </div>
    </div>
  );
}
