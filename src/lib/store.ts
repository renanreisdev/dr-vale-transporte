'use client';

import { useState, useEffect, useCallback } from 'react';
import { VTPeriod, VTCalculationRow, Employee, CompanySettings, LicenseStatus } from '@/types/vt';
import { calculateRow, calculatePeriodSummary, CalculationResult } from './vt-engine';
import { getLicenseStatus } from './license-service';

const STORAGE_KEYS = {
  PERIOD: 'dr_vale_current_period_v1',
  ROWS: 'dr_vale_calculation_rows_v1',
  EMPLOYEES: 'dr_vale_employees_v1',
  COMPANY: 'dr_vale_company_settings_v1',
};

export const INITIAL_PERIOD: VTPeriod = {
  id: 'period-jul-2026',
  year: 2026,
  month: 'Julho/26',
  monthIndex: 6,
  startDate: 1,
  endDate: 18,
  sundaysAndHolidays: 2,
  saturdaysInPeriod: 3,
  unitPrice: 6.25,
  companyName: 'SIDIAL FERRAGENS',
  companyCnpj: '00.000.000/0001-00',
  notes: 'Cálculo de Vale Transporte - Conforme Art. 455 da CLT',
};

export const INITIAL_ROWS: Partial<VTCalculationRow>[] = [
  {
    id: 'row-1',
    name: 'ANDREIA',
    vouchersPerWeekday: 2,
    vouchersPerSaturday: 0,
    saturdaysWorked: 2,
    previousDaysBalance: 0,
    previousAmountBalance: 0,
  },
  {
    id: 'row-2',
    name: 'DIULIA',
    vouchersPerWeekday: 2,
    vouchersPerSaturday: 2,
    saturdaysWorked: 3,
    previousDaysBalance: 4,
    previousAmountBalance: 150,
  },
  {
    id: 'row-3',
    name: 'JEREMIAS',
    vouchersPerWeekday: 2,
    vouchersPerSaturday: 0,
    saturdaysWorked: 3,
    previousDaysBalance: 0,
    previousAmountBalance: 0,
  },
  {
    id: 'row-4',
    name: 'MARIA FRANCISCA',
    vouchersPerWeekday: 2,
    vouchersPerSaturday: 0,
    saturdaysWorked: 3,
    previousDaysBalance: 0,
    previousAmountBalance: 0,
  },
  {
    id: 'row-5',
    name: 'RAQUEL',
    vouchersPerWeekday: 2,
    vouchersPerSaturday: 2,
    saturdaysWorked: 3,
    previousDaysBalance: 0,
    previousAmountBalance: 0,
  },
];

export const INITIAL_COMPANY: CompanySettings = {
  id: 'company-1',
  name: 'SIDIAL FERRAGENS LTDA',
  tradeName: 'SIDIAL FERRAGENS',
  cnpj: '00.000.000/0001-00',
  address: 'Rua Principal, 1000 - Centro',
  city: 'Pelotas',
  state: 'RS',
  phone: '(53) 99122-6768',
  email: 'contato@sidialferragens.com.br',
  responsibleName: 'Reis',
  responsibleRole: 'Gestão de RH & Departamento Pessoal',
};

export function useVTStore() {
  const [period, setPeriodState] = useState<VTPeriod>(INITIAL_PERIOD);
  const [rows, setRowsState] = useState<VTCalculationRow[]>([]);
  const [company, setCompanyState] = useState<CompanySettings>(INITIAL_COMPANY);
  const [license, setLicenseState] = useState<LicenseStatus | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPeriod = localStorage.getItem(STORAGE_KEYS.PERIOD);
      const savedRows = localStorage.getItem(STORAGE_KEYS.ROWS);
      const savedCompany = localStorage.getItem(STORAGE_KEYS.COMPANY);

      const activePeriod: VTPeriod = savedPeriod ? JSON.parse(savedPeriod) : INITIAL_PERIOD;
      const initialRawRows: Partial<VTCalculationRow>[] = savedRows
        ? JSON.parse(savedRows)
        : INITIAL_ROWS;

      // Calculate initial rows
      const calculated = initialRawRows.map((r) => calculateRow(r, activePeriod));

      setPeriodState(activePeriod);
      setRowsState(calculated);
      if (savedCompany) setCompanyState(JSON.parse(savedCompany));
      setLicenseState(getLicenseStatus());
    } catch (e) {
      console.error('Error loading store:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update Period
  const updatePeriod = useCallback(
    (updates: Partial<VTPeriod>) => {
      setPeriodState((prev) => {
        const next = { ...prev, ...updates };
        // Recalculate rows with updated period
        setRowsState((currentRows) => currentRows.map((r) => calculateRow(r, next)));
        localStorage.setItem(STORAGE_KEYS.PERIOD, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  // Update a single row
  const updateRow = useCallback(
    (id: string, updates: Partial<VTCalculationRow>) => {
      setRowsState((prevRows) => {
        const nextRows = prevRows.map((r) => {
          if (r.id === id) {
            const merged = { ...r, ...updates };
            return calculateRow(merged, period);
          }
          return r;
        });
        localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(nextRows));
        return nextRows;
      });
    },
    [period]
  );

  // Add Row
  const addRow = useCallback(
    (newRowData?: Partial<VTCalculationRow>) => {
      setRowsState((prevRows) => {
        const newRow: Partial<VTCalculationRow> = {
          id: crypto.randomUUID(),
          name: '',
          vouchersPerWeekday: 2,
          vouchersPerSaturday: 0,
          saturdaysWorked: period.saturdaysInPeriod || 0,
          previousDaysBalance: 0,
          previousAmountBalance: 0,
          ...newRowData,
        };
        const calculated = calculateRow(newRow, period);
        const nextRows = [...prevRows, calculated];
        localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(nextRows));
        return nextRows;
      });
    },
    [period]
  );

  // Remove Row
  const removeRow = useCallback((id: string) => {
    setRowsState((prevRows) => {
      const nextRows = prevRows.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(nextRows));
      return nextRows;
    });
  }, []);

  // Set all rows (e.g. from Excel Import)
  const setAllRows = useCallback(
    (newRows: Partial<VTCalculationRow>[]) => {
      const calculated = newRows.map((r) => calculateRow(r, period));
      setRowsState(calculated);
      localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(calculated));
    },
    [period]
  );

  // Reset to original Excel template
  const resetToExcelSample = useCallback(() => {
    const calculated = INITIAL_ROWS.map((r) => calculateRow(r, INITIAL_PERIOD));
    setPeriodState(INITIAL_PERIOD);
    setRowsState(calculated);
    setCompanyState(INITIAL_COMPANY);
    localStorage.setItem(STORAGE_KEYS.PERIOD, JSON.stringify(INITIAL_PERIOD));
    localStorage.setItem(STORAGE_KEYS.ROWS, JSON.stringify(calculated));
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(INITIAL_COMPANY));
  }, []);

  // Update Company Settings
  const updateCompany = useCallback((updates: Partial<CompanySettings>) => {
    setCompanyState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Refresh license
  const refreshLicense = useCallback(() => {
    setLicenseState(getLicenseStatus());
  }, []);

  // Summary
  const summary: CalculationResult = calculatePeriodSummary(rows, period);

  return {
    period,
    rows,
    summary,
    company,
    license,
    isLoaded,
    updatePeriod,
    updateRow,
    addRow,
    removeRow,
    setAllRows,
    resetToExcelSample,
    updateCompany,
    refreshLicense,
  };
}
