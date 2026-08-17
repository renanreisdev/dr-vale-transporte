import { VTPeriod, VTCalculationRow } from '@/types/vt';

export interface CalculationResult {
  baseWorkingDays: number;
  rows: VTCalculationRow[];
  totalVouchersCompany: number;
  totalAmountCompany: number;
  totalEmployeesActive: number;
  averageAmountPerEmployee: number;
}

/**
 * Calculates the number of base working days (weekdays) in the period
 * Formula: (Data Final - Data Inicial + 1) - Domingos & Feriados
 */
export function calculateBaseWorkingDays(period: Pick<VTPeriod, 'startDate' | 'endDate' | 'sundaysAndHolidays'>): number {
  const diff = (period.endDate || 0) - (period.startDate || 0) + 1;
  const days = diff - (period.sundaysAndHolidays || 0);
  return Math.max(0, days);
}

/**
 * Calculates a single row for an employee
 */
export function calculateRow(
  row: Partial<VTCalculationRow>,
  period: Pick<VTPeriod, 'startDate' | 'endDate' | 'sundaysAndHolidays' | 'unitPrice'>
): VTCalculationRow {
  const baseDays = calculateBaseWorkingDays(period);
  const name = (row.name || '').trim();
  const vouchersPerWeekday = Number(row.vouchersPerWeekday) || 0;
  const vouchersPerSaturday = Number(row.vouchersPerSaturday) || 0;
  const saturdaysWorked = Number(row.saturdaysWorked) || 0;
  const unitPrice = Number(period.unitPrice) || 0;
  const previousDaysBalance = Number(row.previousDaysBalance) || 0;
  const previousAmountBalance = Number(row.previousAmountBalance) || 0;

  // If no name or 0 vouchers per weekday, calculations yield 0
  if (!name && vouchersPerWeekday === 0) {
    return {
      id: row.id || crypto.randomUUID(),
      employeeId: row.employeeId,
      name: row.name || '',
      vouchersPerWeekday,
      vouchersPerSaturday,
      saturdaysWorked,
      totalVouchers: 0,
      previousDaysBalance,
      previousAmountBalance,
      balanceAdjustment: 0,
      netAmountToCredit: 0,
    };
  }

  // E = (BaseDays * VouchersPerWeekday) + (VouchersPerSaturday * SaturdaysWorked)
  const totalVouchers = (baseDays * vouchersPerWeekday) + (vouchersPerSaturday * saturdaysWorked);

  // J (Balance Adjustment)
  // In Excel formula: =IF((I11<>""),(I11-(H11*B11*C11)*$K$9))
  // If C11 is 0 (doesn't work Saturdays), we use (H11*B11)*K9 for realistic day deduction if H > 0 and C == 0,
  // while preserving exact Excel behavior when C11 > 0.
  let daysVoucherMultiplier = vouchersPerWeekday;
  if (vouchersPerSaturday > 0) {
    daysVoucherMultiplier = vouchersPerWeekday * vouchersPerSaturday;
  }

  let balanceAdjustment = 0;
  if (previousAmountBalance > 0 || previousDaysBalance > 0) {
    const daysDeduction = (previousDaysBalance * daysVoucherMultiplier) * unitPrice;
    balanceAdjustment = previousAmountBalance - daysDeduction;
  }

  // K = (TotalVouchers * UnitPrice) + BalanceAdjustment - PreviousAmountBalance
  let grossAmount = totalVouchers * unitPrice;
  let netAmountToCredit = 0;

  if (totalVouchers > 0 || previousAmountBalance > 0) {
    netAmountToCredit = grossAmount + balanceAdjustment - previousAmountBalance;
    // Prevent negative numbers if balance is larger than period requirement
    if (netAmountToCredit < 0) {
      netAmountToCredit = 0;
    }
  }

  return {
    id: row.id || crypto.randomUUID(),
    employeeId: row.employeeId,
    name,
    vouchersPerWeekday,
    vouchersPerSaturday,
    saturdaysWorked,
    totalVouchers,
    previousDaysBalance,
    previousAmountBalance,
    balanceAdjustment: Math.round(balanceAdjustment * 100) / 100,
    netAmountToCredit: Math.round(netAmountToCredit * 100) / 100,
  };
}

/**
 * Executes full batch calculation across all rows and produces period summary
 */
export function calculatePeriodSummary(
  rows: Partial<VTCalculationRow>[],
  period: VTPeriod
): CalculationResult {
  const baseWorkingDays = calculateBaseWorkingDays(period);
  const calculatedRows = rows.map((r) => calculateRow(r, period));

  const activeRows = calculatedRows.filter((r) => r.name.trim().length > 0);
  const totalVouchersCompany = activeRows.reduce((acc, r) => acc + r.totalVouchers, 0);
  const totalAmountCompany = activeRows.reduce((acc, r) => acc + r.netAmountToCredit, 0);
  const totalEmployeesActive = activeRows.length;
  const averageAmountPerEmployee = totalEmployeesActive > 0 ? totalAmountCompany / totalEmployeesActive : 0;

  return {
    baseWorkingDays,
    rows: calculatedRows,
    totalVouchersCompany,
    totalAmountCompany: Math.round(totalAmountCompany * 100) / 100,
    totalEmployeesActive,
    averageAmountPerEmployee: Math.round(averageAmountPerEmployee * 100) / 100,
  };
}

/**
 * Format currency helper in BRL (R$ 1.234,56)
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

/**
 * Format number helper
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value || 0);
}
