'use client';

import React, { useState, useRef } from 'react';
import { VTPeriod, VTCalculationRow } from '@/types/vt';
import { exportToExcel, importFromExcel } from '@/lib/excel-helper';
import { FileSpreadsheet, Download, Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: VTPeriod;
  rows: VTCalculationRow[];
  companyName: string;
  onImportSuccess: (importedRows: Partial<VTCalculationRow>[]) => void;
}

export default function ImportExportModal({
  isOpen,
  onClose,
  period,
  rows,
  companyName,
  onImportSuccess,
}: ImportExportModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportToExcel(period, rows, companyName);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(null);

    try {
      const result = await importFromExcel(file, period);
      if (result.rows.length === 0) {
        setImportStatus({
          success: false,
          message: 'Nenhum colaborador foi identificado no arquivo. Verifique o modelo da planilha.',
        });
      } else {
        onImportSuccess(result.rows);
        setImportStatus({
          success: true,
          message: `${result.rows.length} colaboradores importados com sucesso!`,
        });
      }
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: err.message || 'Erro ao processar arquivo Excel.',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Importar / Exportar Planilha</h3>
            <p className="text-xs text-slate-500">Compatível com Excel (.xlsx) e formato DR VALE</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Export Box */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Download className="h-4 w-4 text-emerald-600" />
              <span>Exportar Dados Atuais (.XLSX)</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Gera a planilha com as 2 abas estruturadas (Cálculo e Relatório Vales) idênticas ao modelo original.
            </p>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Baixar Planilha Excel
            </button>
          </div>

          {/* Import Box */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Upload className="h-4 w-4 text-blue-600" />
              <span>Importar Colaboradores do Excel</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Envie um arquivo .xlsx ou .csv com nomes e quantidades para preenchimento em massa.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {isProcessing ? 'Processando...' : 'Selecionar Arquivo Excel'}
            </button>
          </div>

          {/* Feedback Status */}
          {importStatus && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 text-xs border ${
                importStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {importStatus.success ? (
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
