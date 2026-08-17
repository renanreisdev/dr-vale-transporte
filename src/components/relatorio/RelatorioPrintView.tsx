'use client';

import React from 'react';
import { VTPeriod, VTCalculationRow, CompanySettings } from '@/types/vt';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import { generateVTReportPDF, generateIndividualReceiptsPDF } from '@/lib/pdf-generator';
import { Printer, Download, FileText, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

interface RelatorioPrintViewProps {
  period: VTPeriod;
  rows: VTCalculationRow[];
  company: CompanySettings;
  watermark?: boolean;
}

export default function RelatorioPrintView({
  period,
  rows,
  company,
  watermark = false,
}: RelatorioPrintViewProps) {
  const activeRows = rows.filter((r) => r.name.trim().length > 0);
  const totalAmount = activeRows.reduce((acc, r) => acc + r.netAmountToCredit, 0);
  const totalVouchers = activeRows.reduce((acc, r) => acc + r.totalVouchers, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateVTReportPDF(period, rows, company.tradeName || company.name, company.cnpj, watermark);
  };

  const handleDownloadReceipts = () => {
    generateIndividualReceiptsPDF(period, rows, company.tradeName || company.name);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-xs border border-slate-200 no-print">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Relatório Oficial de Vale Transporte</h2>
          <p className="text-xs text-slate-500">Documento consolidado pronto para arquivo, contabilidade e impressão</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReceipts}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>Gerar Recibos Individuais</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Exportar PDF Oficial</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Card (A4 Layout) */}
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Company Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                Departamento de Recursos Humanos
              </span>
              <h1 className="text-xl font-black tracking-tight text-slate-900 mt-0.5">
                RELATÓRIO DE VALE TRANSPORTE
              </h1>
              <p className="text-xs font-medium text-slate-600 mt-1">
                EMPRESA: <strong className="text-slate-900 font-bold">{company.name.toUpperCase()}</strong>
                {company.cnpj && ` | CNPJ: ${company.cnpj}`}
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="inline-block rounded bg-slate-100 px-2.5 py-1 font-semibold text-slate-800 border border-slate-200">
                Art. 455 da CLT
              </span>
              <p className="text-[11px] text-slate-400 mt-1.5">Lei nº 7.418/1985</p>
            </div>
          </div>
        </div>

        {/* Period Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg bg-slate-50 p-4 border border-slate-200 mb-6">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Mês de Referência</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{period.month}</p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Período de Apuração</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {period.startDate} a {period.endDate} <span className="text-xs font-normal text-slate-500">({period.sundaysAndHolidays} dom/fer)</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Tarifa do Passe</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrencyBRL(period.unitPrice)}</p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total a Creditar</span>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">{formatCurrencyBRL(totalAmount)}</p>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-hidden rounded-lg border border-slate-300 mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
                <th className="py-2.5 px-4">NOME DO COLABORADOR</th>
                <th className="py-2.5 px-3 w-28 text-center">QTD DE VALES</th>
                <th className="py-2.5 px-4 w-36 text-right">VALOR CREDITADO</th>
                <th className="py-2.5 px-4 w-40 text-center">RUBRICA / ASSINATURA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeRows.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-medium">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 uppercase">{row.name}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{row.totalVouchers} un.</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-800">
                    {formatCurrencyBRL(row.netAmountToCredit)}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="h-6 border-b border-dashed border-slate-300 mx-2"></div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 text-slate-900">
                <td colSpan={2} className="py-3 px-4 text-right uppercase text-xs">
                  VALOR TOTAL GERAL:
                </td>
                <td className="py-3 px-3 text-center text-sm font-black">{totalVouchers} un.</td>
                <td className="py-3 px-4 text-right text-sm font-black text-emerald-800">
                  {formatCurrencyBRL(totalAmount)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legal Disclaimer & Signatures */}
        <div className="space-y-8 pt-4">
          <p className="text-[11px] text-slate-500 italic leading-relaxed">
            * Conforme Artigo 455 da CLT e legislação correlata (Lei nº 7.418/85 e Decreto nº 95.247/87), os valores
            creditados destinam-se exclusivamente ao ressarcimento prévio de despesas de transporte público residência-trabalho.
            O uso indevido constitui falta grave sujeita a demissão por justa causa (Art. 482 CLT).
          </p>

          <div className="grid grid-cols-2 gap-12 pt-6">
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2">
                <p className="text-xs font-semibold text-slate-900">{company.responsibleName || 'Responsável RH'}</p>
                <p className="text-[11px] text-slate-500">{company.responsibleRole || 'Recursos Humanos / DP'}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2">
                <p className="text-xs font-semibold text-slate-900">{company.name}</p>
                <p className="text-[11px] text-slate-500">Diretoria / Financeiro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
