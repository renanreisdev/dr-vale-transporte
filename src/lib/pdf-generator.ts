import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { VTPeriod, VTCalculationRow } from '@/types/vt';
import { formatCurrencyBRL } from './vt-engine';

/**
 * Generates official PDF report for Vale Transporte
 */
export function generateVTReportPDF(
  period: VTPeriod,
  rows: VTCalculationRow[],
  companyName: string = 'SIDIAL FERRAGENS',
  companyCnpj: string = '',
  watermark: boolean = false
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activeRows = rows.filter((r) => r.name.trim().length > 0);
  const totalAmount = activeRows.reduce((acc, r) => acc + r.netAmountToCredit, 0);
  const totalVouchers = activeRows.reduce((acc, r) => acc + r.totalVouchers, 0);

  // Colors
  const primaryDark = [15, 23, 42]; // #0f172a
  const slateBorder = [226, 232, 240];

  // Header Box
  doc.setFillColor(15, 23, 42);
  doc.rect(14, 12, 182, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RELATÓRIO DE VALE TRANSPORTE', 20, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Empresa: ${companyName.toUpperCase()} ${companyCnpj ? `| CNPJ: ${companyCnpj}` : ''}`, 20, 30);

  // Period Meta Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 40, 182, 22, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('MÊS / ANO:', 20, 47);
  doc.text('PERÍODO:', 68, 47);
  doc.text('VALOR PASSAGEM:', 116, 47);
  doc.text('TOTAL A CREDITAR:', 155, 47);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(period.month, 20, 56);
  doc.text(`${period.startDate} a ${period.endDate} (${period.sundaysAndHolidays} dom/fer)`, 68, 56);
  doc.text(formatCurrencyBRL(period.unitPrice), 116, 56);

  doc.setTextColor(22, 101, 52); // Brand green
  doc.text(formatCurrencyBRL(totalAmount), 155, 56);

  // Table Data
  const tableData = activeRows.map((r, index) => [
    (index + 1).toString().padStart(2, '0'),
    r.name,
    r.vouchersPerWeekday.toString(),
    r.saturdaysWorked > 0 ? `${r.vouchersPerSaturday}x (${r.saturdaysWorked} sáb)` : '-',
    r.totalVouchers.toString(),
    r.previousDaysBalance > 0 || r.previousAmountBalance > 0
      ? `${r.previousDaysBalance}d / ${formatCurrencyBRL(r.previousAmountBalance)}`
      : '-',
    formatCurrencyBRL(r.netAmountToCredit),
  ]);

  autoTable(doc, {
    startY: 68,
    head: [['#', 'COLABORADOR', 'VALES/DIA', 'SÁBADOS', 'QTD VALES', 'SALDO ANTERIOR', 'VALOR CREDITADO']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 52 },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 26, halign: 'center' },
      4: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      5: { cellWidth: 28, halign: 'center' },
      6: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: [22, 101, 52] },
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Footer Summary & Signatures
  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // Summary box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, finalY, 182, 16, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`TOTAL DE COLABORADORES: ${activeRows.length}`, 20, finalY + 10);
  doc.text(`TOTAL DE VALES: ${totalVouchers}`, 90, finalY + 10);
  doc.text(`VALOR TOTAL GERAL: ${formatCurrencyBRL(totalAmount)}`, 140, finalY + 10);

  // Legal basis
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Em conformidade com a Lei nº 7.418/1985, Decreto nº 95.247/1987 e Art. 455 da CLT. Benefício de natureza não salarial.',
    14,
    finalY + 24
  );

  // Signatures
  const signY = finalY + 44;
  if (signY < 270) {
    doc.setDrawColor(148, 163, 184);
    doc.line(24, signY, 88, signY);
    doc.line(122, signY, 186, signY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Departamento de Recursos Humanos', 26, signY + 5);
    doc.text('Diretoria / Financeiro', 138, signY + 5);
  }

  // Watermark for trial mode if expired
  if (watermark) {
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('DEMO / NÃO LICENCIADO', 50, 150, { angle: 35 });
  }

  doc.save(`Relatorio_Vale_Transporte_${period.month.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * Generates printable Delivery Receipt Slips for each employee
 */
export function generateIndividualReceiptsPDF(
  period: VTPeriod,
  rows: VTCalculationRow[],
  companyName: string = 'SIDIAL FERRAGENS'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activeRows = rows.filter((r) => r.name.trim().length > 0);

  let currentY = 15;
  const slipHeight = 78;

  activeRows.forEach((row, index) => {
    // If not first on page and next slip would overflow A4 (297mm)
    if (currentY + slipHeight > 280) {
      doc.addPage();
      currentY = 15;
    }

    // Receipt Card
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, currentY, 182, slipHeight - 6, 2, 2, 'FD');

    // Header strip
    doc.setFillColor(30, 41, 59);
    doc.rect(14, currentY, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`COMPROVANTE DE ENTREGA DE VALE TRANSPORTE - ${companyName.toUpperCase()}`, 18, currentY + 7);

    // Body
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Colaborador(a): ${row.name}`, 18, currentY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Mês/Referência: ${period.month}`, 18, currentY + 25);
    doc.text(`Período: ${period.startDate} a ${period.endDate}`, 78, currentY + 25);
    doc.text(`Tarifa Unitária: ${formatCurrencyBRL(period.unitPrice)}`, 130, currentY + 25);

    doc.text(`Qtd. Vales Entregues/Creditados: ${row.totalVouchers} un.`, 18, currentY + 32);
    doc.setFont('helvetica', 'bold');
    doc.text(`Valor Líquido Creditado: ${formatCurrencyBRL(row.netAmountToCredit)}`, 130, currentY + 32);

    // Declaration text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Declaro ter recebido os valores/créditos de vale-transporte para uso exclusivo no meu deslocamento residência-trabalho.',
      18,
      currentY + 42
    );

    // Signature line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Data: ____/____/2026', 18, currentY + 58);
    doc.line(80, currentY + 57, 180, currentY + 57);
    doc.text('Assinatura do Colaborador', 110, currentY + 62);

    currentY += slipHeight;
  });

  doc.save(`Recibos_Vale_Transporte_${period.month.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
