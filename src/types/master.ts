export type LicensePlanType = 'trial' | 'monthly' | 'annual' | 'lifetime' | 'custom';
export type LicenseStatusType = 'active' | 'expired' | 'suspended';
export type PaymentStatusType = 'paid' | 'pending' | 'free_trial';

export interface MasterLicense {
  id: string;
  clientName: string;
  clientTradeName?: string;
  clientCnpj?: string;
  clientEmail?: string;
  clientPhone?: string;
  licenseKey: string;
  planType: LicensePlanType;
  price: number;
  startDate: string;
  expirationDate: string;
  status: LicenseStatusType;
  paymentStatus: PaymentStatusType;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface MasterAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'master';
  isPrimaryMaster?: boolean;
  createdAt: string;
}

export interface ClientDirectoryUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  cnpj?: string;
  phone?: string;
  planType: LicensePlanType;
  licenseStatus: LicenseStatusType;
  licenseKey?: string;
  expirationDate?: string;
  createdAt: string;
}

export interface PlanPricingConfig {
  monthlyPrice: number;
  annualPrice: number;
  lifetimePrice: number;
  trialDurationDays: number;
  supportWhatsapp: string;
  supportEmail: string;
  pixKey?: string;
}

export interface MasterMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeLicensesCount: number;
  trialClientsCount: number;
  totalClientsCount: number;
  expiredLicensesCount: number;
}
