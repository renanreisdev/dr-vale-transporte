import * as XLSX from 'xlsx';
import { VTPeriod, VTCalculationRow } from '@/types/vt';
import { calculateRow } from './vt-engine';

/**
 * Exports current VT period calculations to an Excel workbook (.xlsx)
 */
export function exportToExcel(
  period: VTPeriod,
  rows: VTCalculationRow[],
  companyName: string = 'SIDIAL FERRAGENS'
): void {
  // 1. Build Calculation Sheet Data
  const sheetData: any[][] = [];

  sheetData.push(['PLANILHA DE CÁLCULO - VALE TRANSPORTE', '', '', '', '', '', '', '', '*EMPRESA:', companyName]);
  sheetData.push(['Esta Planilha obedece rigorosamente Art. 455 da CLT', '', '', '', '', '', '', '', '*CNPJ:', period.companyCnpj || '']);
  sheetData.push([]);
  sheetData.push(['Ano corrente', '', 'MÊS DE REFERÊNCIA :', '', '', '', period.month]);
  sheetData.push([period.year]);
  sheetData.push([]);
  sheetData.push([
    '*NOME',
    'Segunda ao dia (Vales/dia)',
    'SÁBADOS (Vales/sáb)',
    'Nº de Sáb no período',
    '*Data inicial',
    '*Data Final',
    'Domingos & Feriados',
    'Dias Saldo Anterior',
    'Saldo Vale R$',
    'Saldo Valor (Ajuste)',
    '*VALOR DO VALE TRANSP',
    '*VALOR TOTAL LÍQUIDO',
  ]);

  // Parameters row
  sheetData.push([
    '',
    '',
    '',
    '',
    period.startDate,
    period.endDate,
    period.sundaysAndHolidays,
    '',
    '',
    '',
    period.unitPrice,
    rows.reduce((sum, r) => sum + r.netAmountToCredit, 0),
  ]);

  // Employee Rows
  rows.forEach((r) => {
    if (r.name.trim()) {
      sheetData.push([
        r.name,
        r.vouchersPerWeekday,
        r.vouchersPerSaturday,
        r.saturdaysWorked,
        r.totalVouchers,
        '',
        '',
        r.previousDaysBalance,
        r.previousAmountBalance,
        r.balanceAdjustment,
        r.netAmountToCredit,
        '',
      ]);
    }
  });

  // 2. Build Report Sheet Data
  const reportData: any[][] = [];
  reportData.push(['RELATÓRIO DE VALE TRANSPORTE', '', '', '', companyName]);
  reportData.push(['', '', '', '', 'EMPRESA: ' + companyName]);
  reportData.push([]);
  reportData.push(['', 'Valor passagem', 'Período', '', '', 'Mês/Ano']);
  reportData.push(['', period.unitPrice, `${period.startDate} a ${period.endDate}`, '', '', period.month]);
  reportData.push([]);
  reportData.push(['Nomes:', 'Qtd de Vales', 'Valor Creditado', '', 'Valor Total']);

  const activeRows = rows.filter((r) => r.name.trim());
  activeRows.forEach((r, idx) => {
    reportData.push([
      r.name,
      r.totalVouchers,
      r.netAmountToCredit,
      '',
      idx === 0 ? rows.reduce((sum, row) => sum + row.netAmountToCredit, 0) : '',
    ]);
  });

  // Create WorkBook
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(sheetData);
  const ws2 = XLSX.utils.aoa_to_sheet(reportData);

  XLSX.utils.book_append_sheet(wb, ws1, 'VALE TRANSPORTES CÁLCULO');
  XLSX.utils.book_append_sheet(wb, ws2, 'RELATÓRIO VALES');

  // Trigger download
  const cleanMonth = period.month.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `Vale_Transporte_${cleanMonth}_${period.year}.xlsx`);
}

/**
 * Parses an imported Excel or CSV file and extracts VT rows
 */
export async function importFromExcel(
  file: File,
  currentPeriod: VTPeriod
): Promise<{ rows: Partial<VTCalculationRow>[]; detectedParams?: Partial<VTPeriod> }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const extractedRows: Partial<VTCalculationRow>[] = [];
        let detectedParams: Partial<VTPeriod> = {};

        // Find header row or employee names
        let startRowIndex = 0;
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.some((cell) => String(cell).toUpperCase().includes('NOME'))) {
            startRowIndex = i + 1;
            break;
          }
        }

        // Parse rows
        for (let i = startRowIndex; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || !row[0]) continue;

          const name = String(row[0]).trim();
          if (!name || name.startsWith('*') || name.toUpperCase().includes('TOTAL') || name.toUpperCase().includes('QTD')) {
            continue;
          }

          const vouchersPerWeekday = Number(row[1]) || 2;
          const vouchersPerSaturday = Number(row[2]) || 0;
          const saturdaysWorked = Number(row[3]) || 0;
          const previousDaysBalance = Number(row[7]) || 0;
          const previousAmountBalance = Number(row[8]) || 0;

          extractedRows.push({
            name,
            vouchersPerWeekday,
            vouchersPerSaturday,
            saturdaysWorked,
            previousDaysBalance,
            previousAmountBalance,
          });
        }

        resolve({ rows: extractedRows, detectedParams });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
