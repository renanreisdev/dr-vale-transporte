'use client';

import React from 'react';
import { VTPeriod } from '@/types/vt';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import { Calendar, DollarSign, Building2, CloudCheck, Check } from 'lucide-react';

interface HeaderProps {
  period: VTPeriod;
  companyName?: string;
  onSave?: () => void;
}

export default function Header({ period, companyName = 'SIDIAL FERRAGENS', onSave }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-6 shadow-xs no-print">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <h1 className="text-sm font-semibold text-slate-900">{companyName}</h1>
          </div>
          <p className="text-xs text-slate-500">Sistema Oficial de Cálculo de Vale Transporte</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Period Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700 border border-slate-200">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold">{period.month}</span>
          <span className="text-slate-400">|</span>
          <span>
            {period.startDate} a {period.endDate} ({period.sundaysAndHolidays} dom/fer)
          </span>
        </div>

        {/* Unit Tariff Badge */}
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 border border-emerald-200">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          <span>Passe:</span>
          <strong className="font-semibold">{formatCurrencyBRL(period.unitPrice)}</strong>
        </div>

        {onSave && (
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-slate-800 transition"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Salvo</span>
          </button>
        )}
      </div>
    </header>
  );
}
