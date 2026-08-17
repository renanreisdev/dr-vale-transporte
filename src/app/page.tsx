'use client';

import React, { useState } from 'react';
import { useVTStore } from '@/lib/store';
import PeriodoConfigCard from '@/components/calculo/PeriodoConfigCard';
import ResumoCard from '@/components/calculo/ResumoCard';
import CalculoTable from '@/components/calculo/CalculoTable';
import ImportExportModal from '@/components/calculo/ImportExportModal';
import { Bus, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardCalculoPage() {
  const {
    period,
    rows,
    summary,
    company,
    updatePeriod,
    updateRow,
    addRow,
    removeRow,
    setAllRows,
    resetToExcelSample,
  } = useVTStore();

  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              Cálculo em Tempo Real
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Art. 455 CLT • Lei nº 7.418/85
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Planilha de Cálculo de Vale Transporte
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Preencha os dias úteis, sábados trabalhados e saldos anteriores para obter instantaneamente a
            quantidade de vales e o valor líquido individual e total a creditar pela empresa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/relatorios"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ver Relatório Oficial</span>
          </Link>
        </div>
      </div>

      {/* KPI Resumo */}
      <ResumoCard
        summary={summary}
        onAddRow={() => addRow()}
        onOpenImportExport={() => setIsImportExportOpen(true)}
      />

      {/* Period Configuration Card */}
      <PeriodoConfigCard period={period} onUpdatePeriod={updatePeriod} />

      {/* Interactive Calculation Table */}
      <CalculoTable
        period={period}
        rows={rows}
        baseWorkingDays={summary.baseWorkingDays}
        totalCompanyAmount={summary.totalAmountCompany}
        totalCompanyVouchers={summary.totalVouchersCompany}
        onUpdateRow={updateRow}
        onAddRow={() => addRow()}
        onRemoveRow={removeRow}
        onResetSample={resetToExcelSample}
        onOpenImportExport={() => setIsImportExportOpen(true)}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        period={period}
        rows={rows}
        companyName={company.tradeName || company.name || period.companyName}
        onImportSuccess={(newRows) => {
          setAllRows(newRows);
          setIsImportExportOpen(false);
        }}
      />
    </div>
  );
}
