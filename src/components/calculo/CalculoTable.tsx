'use client';

import React, { useState } from 'react';
import { VTPeriod, VTCalculationRow } from '@/types/vt';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import {
  Plus,
  Trash2,
  Copy,
  Search,
  RotateCcw,
  FileSpreadsheet,
  ArrowUpDown,
  Download,
  Upload,
  Info,
} from 'lucide-react';

interface CalculoTableProps {
  period: VTPeriod;
  rows: VTCalculationRow[];
  baseWorkingDays: number;
  totalCompanyAmount: number;
  totalCompanyVouchers: number;
  onUpdateRow: (id: string, updates: Partial<VTCalculationRow>) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onResetSample: () => void;
  onOpenImportExport: () => void;
}

export default function CalculoTable({
  period,
  rows,
  baseWorkingDays,
  totalCompanyAmount,
  totalCompanyVouchers,
  onUpdateRow,
  onAddRow,
  onRemoveRow,
  onResetSample,
  onOpenImportExport,
}: CalculoTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const duplicateRow = (row: VTCalculationRow) => {
    onAddRow();
    // update newly added with duplicated properties
    const last = rows[rows.length - 1];
    if (last) {
      onUpdateRow(last.id, {
        name: `${row.name} (Cópia)`,
        vouchersPerWeekday: row.vouchersPerWeekday,
        vouchersPerSaturday: row.vouchersPerSaturday,
        saturdaysWorked: row.saturdaysWorked,
        previousDaysBalance: 0,
        previousAmountBalance: 0,
      });
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-xs border border-slate-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar colaborador..."
              className="h-8.5 rounded-lg border border-slate-300 pl-8.5 pr-3 text-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-56"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredRows.length} de {rows.length} colaboradores
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetSample}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition shadow-2xs"
            title="Restaurar dados originais da planilha Excel"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Dados Originais Excel</span>
          </button>

          <button
            type="button"
            onClick={onOpenImportExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Importar / Exportar Excel</span>
          </button>

          <button
            type="button"
            onClick={onAddRow}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Colaborador</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold">
              <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
              <th className="py-2.5 px-3 min-w-[180px]">*NOME DO COLABORADOR</th>
              <th className="py-2.5 px-2.5 w-24 text-center" title="Quantidade de vales por dia de Seg a Sex">
                Seg a Sex (vales/dia)
              </th>
              <th className="py-2.5 px-2.5 w-24 text-center" title="Quantidade de vales por Sábado trabalhado">
                Sábados (vales/dia)
              </th>
              <th className="py-2.5 px-2.5 w-24 text-center" title="Quantidade de Sábados trabalhados no período">
                Nº de Sáb no Período
              </th>
              <th className="py-2.5 px-3 w-24 text-center bg-slate-800 text-emerald-400 font-bold">
                QTD. VALES
              </th>
              <th className="py-2.5 px-2.5 w-24 text-center" title="Dias de saldo anterior a descontar">
                Saldo Dias Ant.
              </th>
              <th className="py-2.5 px-3 w-28 text-right" title="Valor do saldo anterior em R$">
                Saldo Vale R$
              </th>
              <th className="py-2.5 px-3 w-28 text-right bg-slate-800 text-slate-300" title="Ajuste calculado de saldo">
                Ajuste Saldo
              </th>
              <th className="py-2.5 px-4 w-36 text-right bg-emerald-900 text-white font-bold">
                *VALOR LÍQUIDO
              </th>
              <th className="py-2.5 px-2 w-16 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500 text-xs">
                  Nenhum colaborador encontrado. Clique em "Adicionar Colaborador" acima.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      isEven ? 'bg-white' : 'bg-slate-50/60'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2 px-3 text-center font-mono text-slate-400 font-medium text-[11px]">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>

                    {/* Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => onUpdateRow(row.id, { name: e.target.value })}
                        placeholder="Nome do colaborador..."
                        className="w-full rounded border border-transparent hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:outline-none px-2 py-1 font-medium text-slate-900 uppercase"
                      />
                    </td>

                    {/* Weekday vouchers (B) */}
                    <td className="py-2 px-2.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={row.vouchersPerWeekday}
                        onChange={(e) =>
                          onUpdateRow(row.id, { vouchersPerWeekday: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-16 text-center rounded border border-slate-300 focus:border-emerald-600 focus:outline-none px-1.5 py-1 font-medium text-slate-900 bg-white"
                      />
                    </td>

                    {/* Saturday vouchers (C) */}
                    <td className="py-2 px-2.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={row.vouchersPerSaturday}
                        onChange={(e) =>
                          onUpdateRow(row.id, { vouchersPerSaturday: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-16 text-center rounded border border-slate-300 focus:border-emerald-600 focus:outline-none px-1.5 py-1 font-medium text-slate-900 bg-white"
                      />
                    </td>

                    {/* Saturdays worked (D) */}
                    <td className="py-2 px-2.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={row.saturdaysWorked}
                        onChange={(e) =>
                          onUpdateRow(row.id, { saturdaysWorked: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-16 text-center rounded border border-slate-300 focus:border-emerald-600 focus:outline-none px-1.5 py-1 font-medium text-slate-900 bg-white"
                      />
                    </td>

                    {/* Total Vouchers (E) */}
                    <td className="py-2 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50">
                      {row.totalVouchers} <span className="text-[10px] font-normal text-slate-500">un</span>
                    </td>

                    {/* Previous Days Balance (H) */}
                    <td className="py-2 px-2.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={31}
                        value={row.previousDaysBalance}
                        onChange={(e) =>
                          onUpdateRow(row.id, { previousDaysBalance: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-16 text-center rounded border border-slate-300 focus:border-emerald-600 focus:outline-none px-1.5 py-1 text-slate-700 bg-white"
                      />
                    </td>

                    {/* Previous Amount Balance R$ (I) */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={row.previousAmountBalance}
                        onChange={(e) =>
                          onUpdateRow(row.id, { previousAmountBalance: parseFloat(e.target.value) || 0 })
                        }
                        className="w-24 text-right rounded border border-slate-300 focus:border-emerald-600 focus:outline-none px-2 py-1 text-slate-700 bg-white"
                      />
                    </td>

                    {/* Balance Adjustment (J) */}
                    <td className="py-2 px-3 text-right font-mono text-slate-600 bg-slate-50">
                      {formatCurrencyBRL(row.balanceAdjustment)}
                    </td>

                    {/* Net Amount to Credit (K) */}
                    <td className="py-2 px-4 text-right font-bold text-emerald-700 bg-emerald-50/70 text-sm">
                      {formatCurrencyBRL(row.netAmountToCredit)}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => duplicateRow(row)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                          title="Duplicar colaborador"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveRow(row.id)}
                          className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition"
                          title="Excluir colaborador"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Footer Totals */}
          <tfoot>
            <tr className="bg-slate-900 text-white font-bold">
              <td colSpan={5} className="py-3 px-4 text-right text-xs uppercase tracking-wider text-slate-300">
                TOTAIS DA EMPRESA ({period.companyName || 'SIDIAL FERRAGENS'}):
              </td>
              <td className="py-3 px-3 text-center text-emerald-400 font-bold bg-slate-800 text-sm">
                {totalCompanyVouchers} un.
              </td>
              <td colSpan={3} className="py-3 px-3 text-right text-xs text-slate-400">
                Valor Unitário: {formatCurrencyBRL(period.unitPrice)}
              </td>
              <td className="py-3 px-4 text-right text-base text-emerald-400 bg-emerald-950 font-black">
                {formatCurrencyBRL(totalCompanyAmount)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Explanatory Formula Footer Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>
            <strong>Fórmula Qtd Vales:</strong> ({baseWorkingDays} dias úteis × Vales/dia) + (Sábados × Vales/sáb)
          </span>
        </div>
        <div>
          <span>
            <strong>Fórmula Valor Líquido:</strong> (Qtd Vales × {formatCurrencyBRL(period.unitPrice)}) + Ajuste Saldo - Saldo Vale R$
          </span>
        </div>
      </div>
    </div>
  );
}
