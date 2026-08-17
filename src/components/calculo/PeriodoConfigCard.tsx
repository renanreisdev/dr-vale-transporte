'use client';

import React, { useState } from 'react';
import { VTPeriod } from '@/types/vt';
import { MONTHS_PT_BR, calculateCalendarStats } from '@/lib/calendar-helper';
import { calculateBaseWorkingDays } from '@/lib/vt-engine';
import { Calendar, Wand2, Info, Sparkles, Check } from 'lucide-react';

interface PeriodoConfigCardProps {
  period: VTPeriod;
  onUpdatePeriod: (updates: Partial<VTPeriod>) => void;
}

export default function PeriodoConfigCard({ period, onUpdatePeriod }: PeriodoConfigCardProps) {
  const [autoCalculatedMsg, setAutoCalculatedMsg] = useState<string | null>(null);

  const baseDays = calculateBaseWorkingDays(period);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mIndex = parseInt(e.target.value, 10);
    const monthObj = MONTHS_PT_BR[mIndex];
    const shortYear = String(period.year).slice(-2);
    const monthLabel = `${monthObj.name}/${shortYear}`;
    onUpdatePeriod({
      monthIndex: mIndex,
      month: monthLabel,
    });
  };

  const handleAutoDetectCalendar = () => {
    const stats = calculateCalendarStats(
      period.year,
      period.monthIndex,
      period.startDate,
      period.endDate
    );

    onUpdatePeriod({
      sundaysAndHolidays: stats.sundaysAndHolidaysCount,
      saturdaysInPeriod: stats.saturdaysCount,
    });

    let msg = `Detectado: ${stats.sundaysCount} domingo(s), ${stats.saturdaysCount} sábado(s)`;
    if (stats.holidaysCount > 0) {
      msg += ` e ${stats.holidaysCount} feriado (${stats.holidayDetails.map((h) => h.name).join(', ')})`;
    }
    setAutoCalculatedMsg(msg);
    setTimeout(() => setAutoCalculatedMsg(null), 5000);
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Parâmetros do Período de Cálculo</h2>
            <p className="text-[11px] text-slate-500">
              Campos marcados com * alteram o cálculo de dias úteis e valores individuais
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoDetectCalendar}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition shadow-2xs"
          title="Detectar automaticamente sábados, domingos e feriados deste período no calendário"
        >
          <Wand2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Auto-detectar pelo Calendário</span>
        </button>
      </div>

      {autoCalculatedMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200 animate-in fade-in">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{autoCalculatedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Ano */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Ano Corrente
          </label>
          <input
            type="number"
            value={period.year}
            onChange={(e) => {
              const yr = parseInt(e.target.value, 10) || 2026;
              const shortYear = String(yr).slice(-2);
              const mName = MONTHS_PT_BR[period.monthIndex]?.name || 'Julho';
              onUpdatePeriod({ year: yr, month: `${mName}/${shortYear}` });
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Mês de Referência */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            *Mês de Referência
          </label>
          <select
            value={period.monthIndex}
            onChange={handleMonthChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
          >
            {MONTHS_PT_BR.map((m) => (
              <option key={m.index} value={m.index}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Data Inicial */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            *Data Inicial (Dia)
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={period.startDate}
            onChange={(e) => onUpdatePeriod({ startDate: parseInt(e.target.value, 10) || 1 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-center"
          />
        </div>

        {/* Data Final */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            *Data Final (Dia)
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={period.endDate}
            onChange={(e) => onUpdatePeriod({ endDate: parseInt(e.target.value, 10) || 1 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-center"
          />
        </div>

        {/* Domingos & Feriados */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            *Domingos & Feriados
          </label>
          <input
            type="number"
            min={0}
            max={31}
            value={period.sundaysAndHolidays}
            onChange={(e) => onUpdatePeriod({ sundaysAndHolidays: parseInt(e.target.value, 10) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-center"
          />
        </div>

        {/* Valor da Passagem Unitária */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            *Valor da Passagem (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min={0.01}
            value={period.unitPrice}
            onChange={(e) => onUpdatePeriod({ unitPrice: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-emerald-800 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-right"
          />
        </div>
      </div>

      {/* Working days formula result info */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3.5 py-2 text-xs border border-slate-200">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Fórmula de Dias Úteis do Período:</span>
          <code className="rounded bg-slate-200 px-1 py-0.5 text-[11px] font-mono text-slate-800">
            ({period.endDate} - {period.startDate} + 1) - {period.sundaysAndHolidays} dom/fer
          </code>
        </div>
        <div className="font-semibold text-slate-900">
          Total de Dias Úteis Base: <span className="text-emerald-700 text-sm font-bold">{baseDays} dias</span>
        </div>
      </div>
    </div>
  );
}
