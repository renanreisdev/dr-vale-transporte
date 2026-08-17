'use client';

import React, { useState } from 'react';
import { VTPeriod, VTCalculationRow, CompanySettings } from '@/types/vt';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import { generateIndividualReceiptsPDF } from '@/lib/pdf-generator';
import { FileText, Download, Printer, X, Check } from 'lucide-react';

interface ReciboIndividualModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: VTPeriod;
  rows: VTCalculationRow[];
  company: CompanySettings;
}

export default function ReciboIndividualModal({
  isOpen,
  onClose,
  period,
  rows,
  company,
}: ReciboIndividualModalProps) {
  const activeRows = rows.filter((r) => r.name.trim().length > 0);
  const [selectedId, setSelectedId] = useState<string>(activeRows[0]?.id || '');

  if (!isOpen) return null;

  const selectedRow = activeRows.find((r) => r.id === selectedId) || activeRows[0];

  const handleDownloadAll = () => {
    generateIndividualReceiptsPDF(period, rows, company.tradeName || company.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Comprovante de Entrega de Vale Transporte</h3>
            <p className="text-xs text-slate-500">Recibo individual para assinatura do colaborador</p>
          </div>
        </div>

        {/* Employee Selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-700 mb-1">Selecionar Colaborador</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none bg-white"
          >
            {activeRows.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.totalVouchers} vales ({formatCurrencyBRL(r.netAmountToCredit)})
              </option>
            ))}
          </select>
        </div>

        {/* Receipt Preview Slip */}
        {selectedRow && (
          <div className="rounded-xl border border-slate-300 p-5 bg-slate-50 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {company.name.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-slate-900">RECIBO DE ENTREGA DE VALE TRANSPORTE</h4>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                {period.month}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500">Colaborador(a):</span>
                <p className="font-bold text-slate-900 uppercase">{selectedRow.name}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Período de Apuração:</span>
                <p className="font-medium text-slate-900">{period.startDate} a {period.endDate} de {period.month}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Quantidade de Vales:</span>
                <p className="font-bold text-emerald-800">{selectedRow.totalVouchers} unidades</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Valor Líquido Creditado:</span>
                <p className="font-bold text-emerald-700">{formatCurrencyBRL(selectedRow.netAmountToCredit)}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic bg-white p-2.5 rounded border border-slate-200">
              Declaro que recebi a importância / quantidade de passes acima descrita, para utilização exclusiva em meu deslocamento residência-trabalho e vice-versa, nos termos da Lei nº 7.418/85 e Decreto nº 95.247/87.
            </p>

            <div className="pt-4 flex items-end justify-between text-xs text-slate-600">
              <span>Data: ____/____/2026</span>
              <div className="text-center w-64">
                <div className="border-b border-slate-400 mb-1"></div>
                <span className="text-[11px]">Assinatura do Colaborador</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={handleDownloadAll}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Baixar Todos os Recibos em PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
