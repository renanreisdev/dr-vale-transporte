export interface VTPeriod {
  id: string;
  year: number;
  month: string; // e.g., "Julho/26"
  monthIndex: number; // 0-11
  startDate: number; // e.g. 1
  endDate: number; // e.g. 18
  sundaysAndHolidays: number; // e.g. 2
  saturdaysInPeriod: number; // e.g. 3
  unitPrice: number; // e.g. 6.25
  companyName: string; // e.g. "SIDIAL FERRAGENS"
  companyCnpj?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  department?: string;
  role?: string;
  cpf?: string;
  active: boolean;
  defaultVouchersPerWeekday: number; // default e.g. 2
  defaultVouchersPerSaturday: number; // default e.g. 0 or 2
  defaultSaturdaysCount: number; // default e.g. 3
  customUnitPrice?: number | null; // if differs from period
  createdAt?: string;
}

export interface VTCalculationRow {
  id: string;
  employeeId?: string;
  name: string;
  vouchersPerWeekday: number; // B: Segunda ao dia
  vouchersPerSaturday: number; // C: Sábados
  saturdaysWorked: number; // D: Nº de Sáb no período
  totalVouchers: number; // E: Qtd. Vales calculated
  previousDaysBalance: number; // H: Dias do Período Anterior
  previousAmountBalance: number; // I: Saldo Vale R$
  balanceAdjustment: number; // J: Saldo Valor
  netAmountToCredit: number; // K: VALE TRANSP - Valor Líquido Individual
}

export interface CompanySettings {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  responsibleName: string;
  responsibleRole: string;
  logoUrl?: string;
}

export interface LicenseStatus {
  isLicensed: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  trialStartDate: string;
  trialEndDate: string;
  licenseKey?: string;
  licensedTo?: string;
  licenseType: 'trial' | 'monthly' | 'annual' | 'lifetime';
  expirationDate?: string;
  features: {
    maxEmployees: number; // -1 for unlimited
    exportPdf: boolean;
    exportExcel: boolean;
    cloudSync: boolean;
    watermark: boolean;
  };
}

export interface LegalTopic {
  id: string;
  title: string;
  category: 'CLT' | 'JUSTA_CAUSA' | 'INTERVALO' | 'LEGISLACAO';
  articleRef: string;
  summary: string;
  fullText: string;
  implications: string[];
  recommendations: string[];
}
