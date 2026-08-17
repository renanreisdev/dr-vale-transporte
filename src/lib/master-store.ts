'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MasterLicense,
  MasterAdminUser,
  ClientDirectoryUser,
  PlanPricingConfig,
  MasterMetrics,
  LicensePlanType,
} from '@/types/master';
import { generateLicenseKey } from './license-service';

const STORAGE_KEYS = {
  LICENSES: 'dr_vale_master_licenses_v1',
  MASTER_ADMINS: 'dr_vale_master_admins_v1',
  CLIENTS: 'dr_vale_master_clients_v1',
  PRICING: 'dr_vale_master_pricing_v1',
};

export const INITIAL_PRICING: PlanPricingConfig = {
  monthlyPrice: 49.0,
  annualPrice: 380.0,
  lifetimePrice: 790.0,
  trialDurationDays: 14,
  supportWhatsapp: '5553991226768',
  supportEmail: 'contato@drvale.com.br',
  pixKey: '53991226768',
};

export const INITIAL_MASTER_ADMINS: MasterAdminUser[] = [
  {
    id: 'master-1',
    name: 'Renan Reis',
    email: 'renanreis.dev@gmail.com',
    role: 'master',
    isPrimaryMaster: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_LICENSES: MasterLicense[] = [
  {
    id: 'lic-1',
    clientName: 'SIDIAL FERRAGENS LTDA',
    clientTradeName: 'SIDIAL FERRAGENS',
    clientCnpj: '00.000.000/0001-00',
    clientEmail: 'financeiro@sidialferragens.com.br',
    clientPhone: '(53) 99122-6768',
    licenseKey: 'DRVALE-LIF-SIDIAL-LIFETIME-A9F3X2',
    planType: 'lifetime',
    price: 790.0,
    startDate: '2026-01-01T00:00:00.000Z',
    expirationDate: '2099-12-31T23:59:59.000Z',
    status: 'active',
    paymentStatus: 'paid',
    createdAt: '2026-01-01T00:00:00.000Z',
    notes: 'Cliente fundador - Licença Vitalícia',
  },
  {
    id: 'lic-2',
    clientName: 'TRANSPORTES SUL BRASIL',
    clientTradeName: 'SUL BRASIL',
    clientCnpj: '11.222.333/0001-44',
    clientEmail: 'dp@sulbrasil.com.br',
    clientPhone: '(53) 98400-1122',
    licenseKey: 'DRVALE-A01-SULBRASI-20271231-K7B2M9',
    planType: 'annual',
    price: 380.0,
    startDate: '2026-01-15T00:00:00.000Z',
    expirationDate: '2027-01-15T23:59:59.000Z',
    status: 'active',
    paymentStatus: 'paid',
    createdAt: '2026-01-15T00:00:00.000Z',
    notes: 'Renovação anual com 30 colaboradores',
  },
  {
    id: 'lic-3',
    clientName: 'COMÉRCIO DE ALIMENTOS ESTRELA',
    clientTradeName: 'MERCADO ESTRELA',
    clientCnpj: '22.333.444/0001-55',
    clientEmail: 'rh@mercadoestrela.com.br',
    clientPhone: '(51) 99988-7766',
    licenseKey: 'DRVALE-T30-ESTRELA-20260915-P3W8R1',
    planType: 'trial',
    price: 0,
    startDate: '2026-08-01T00:00:00.000Z',
    expirationDate: '2026-09-01T23:59:59.000Z',
    status: 'active',
    paymentStatus: 'free_trial',
    createdAt: '2026-08-01T00:00:00.000Z',
    notes: 'Avaliação de 30 dias em andamento',
  },
];

export const INITIAL_CLIENTS: ClientDirectoryUser[] = [
  {
    id: 'client-1',
    name: 'Reis Gestão de RH',
    email: 'financeiro@sidialferragens.com.br',
    companyName: 'SIDIAL FERRAGENS',
    cnpj: '00.000.000/0001-00',
    phone: '(53) 99122-6768',
    planType: 'lifetime',
    licenseStatus: 'active',
    licenseKey: 'DRVALE-LIF-SIDIAL-LIFETIME-A9F3X2',
    expirationDate: '2099-12-31T23:59:59.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'client-2',
    name: 'Juliana Mendes',
    email: 'dp@sulbrasil.com.br',
    companyName: 'TRANSPORTES SUL BRASIL',
    cnpj: '11.222.333/0001-44',
    phone: '(53) 98400-1122',
    planType: 'annual',
    licenseStatus: 'active',
    licenseKey: 'DRVALE-A01-SULBRASI-20271231-K7B2M9',
    expirationDate: '2027-01-15T23:59:59.000Z',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'client-3',
    name: 'Marcos Estrela',
    email: 'rh@mercadoestrela.com.br',
    companyName: 'COMÉRCIO DE ALIMENTOS ESTRELA',
    cnpj: '22.333.444/0001-55',
    phone: '(51) 99988-7766',
    planType: 'trial',
    licenseStatus: 'active',
    licenseKey: 'DRVALE-T30-ESTRELA-20260915-P3W8R1',
    expirationDate: '2026-09-01T23:59:59.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

export function useMasterStore() {
  const [licenses, setLicenses] = useState<MasterLicense[]>(INITIAL_LICENSES);
  const [masterAdmins, setMasterAdmins] = useState<MasterAdminUser[]>(INITIAL_MASTER_ADMINS);
  const [clients, setClients] = useState<ClientDirectoryUser[]>(INITIAL_CLIENTS);
  const [pricingConfig, setPricingConfig] = useState<PlanPricingConfig>(INITIAL_PRICING);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLic = localStorage.getItem(STORAGE_KEYS.LICENSES);
      const savedAdmins = localStorage.getItem(STORAGE_KEYS.MASTER_ADMINS);
      const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      const savedPricing = localStorage.getItem(STORAGE_KEYS.PRICING);

      if (savedLic) setLicenses(JSON.parse(savedLic));
      if (savedAdmins) setMasterAdmins(JSON.parse(savedAdmins));
      if (savedClients) setClients(JSON.parse(savedClients));
      if (savedPricing) setPricingConfig(JSON.parse(savedPricing));
    } catch (e) {
      console.error('Error loading master store:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save helpers
  const saveLicenses = (newLicenses: MasterLicense[]) => {
    setLicenses(newLicenses);
    localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(newLicenses));
  };

  const saveAdmins = (newAdmins: MasterAdminUser[]) => {
    setMasterAdmins(newAdmins);
    localStorage.setItem(STORAGE_KEYS.MASTER_ADMINS, JSON.stringify(newAdmins));
  };

  const saveClients = (newClients: ClientDirectoryUser[]) => {
    setClients(newClients);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(newClients));
  };

  const savePricing = (newPricing: PlanPricingConfig) => {
    setPricingConfig(newPricing);
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(newPricing));
  };

  // Add License
  const addLicense = useCallback(
    (licenseData: {
      clientName: string;
      clientTradeName?: string;
      clientCnpj?: string;
      clientEmail?: string;
      clientPhone?: string;
      planType: LicensePlanType;
      price: number;
      durationDays?: number;
      notes?: string;
    }) => {
      const typeCode =
        licenseData.planType === 'lifetime'
          ? 'LIF'
          : licenseData.planType === 'annual'
          ? 'A01'
          : licenseData.planType === 'monthly'
          ? 'M01'
          : 'T30';

      const days =
        licenseData.durationDays ||
        (licenseData.planType === 'annual'
          ? 365
          : licenseData.planType === 'monthly'
          ? 30
          : licenseData.planType === 'lifetime'
          ? 36500
          : 14);

      const expDate = new Date(Date.now() + days * 86400000);
      const expDateStr = expDate.toISOString().slice(0, 10);
      const generatedKey = generateLicenseKey(typeCode, licenseData.clientName, expDateStr);

      const newLicense: MasterLicense = {
        id: 'lic-' + Date.now(),
        clientName: licenseData.clientName.trim().toUpperCase(),
        clientTradeName: licenseData.clientTradeName?.trim().toUpperCase() || licenseData.clientName.trim().toUpperCase(),
        clientCnpj: licenseData.clientCnpj || '',
        clientEmail: licenseData.clientEmail || '',
        clientPhone: licenseData.clientPhone || '',
        licenseKey: generatedKey,
        planType: licenseData.planType,
        price: Number(licenseData.price) || 0,
        startDate: new Date().toISOString(),
        expirationDate: expDate.toISOString(),
        status: 'active',
        paymentStatus: licenseData.price > 0 ? 'paid' : 'free_trial',
        createdAt: new Date().toISOString(),
        notes: licenseData.notes || '',
      };

      const updated = [newLicense, ...licenses];
      saveLicenses(updated);

      // Sync to clients directory as well
      const newClient: ClientDirectoryUser = {
        id: 'client-' + Date.now(),
        name: licenseData.clientName,
        email: licenseData.clientEmail || `cliente_${Date.now()}@empresa.com.br`,
        companyName: licenseData.clientTradeName || licenseData.clientName,
        cnpj: licenseData.clientCnpj,
        phone: licenseData.clientPhone,
        planType: licenseData.planType,
        licenseStatus: 'active',
        licenseKey: generatedKey,
        expirationDate: expDate.toISOString(),
        createdAt: new Date().toISOString(),
      };
      saveClients([newClient, ...clients]);

      return newLicense;
    },
    [licenses, clients]
  );

  // Extend License
  const extendLicense = useCallback(
    (id: string, additionalDays: number) => {
      const updated = licenses.map((lic) => {
        if (lic.id === id) {
          const currentExp = new Date(lic.expirationDate);
          const baseTime = currentExp.getTime() > Date.now() ? currentExp.getTime() : Date.now();
          const newExp = new Date(baseTime + additionalDays * 86400000);
          return {
            ...lic,
            expirationDate: newExp.toISOString(),
            status: 'active' as const,
            updatedAt: new Date().toISOString(),
          };
        }
        return lic;
      });
      saveLicenses(updated);
    },
    [licenses]
  );

  // Toggle License Status (Active / Suspended)
  const toggleLicenseStatus = useCallback(
    (id: string) => {
      const updated = licenses.map((lic) => {
        if (lic.id === id) {
          const nextStatus = lic.status === 'active' ? ('suspended' as const) : ('active' as const);
          return { ...lic, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return lic;
      });
      saveLicenses(updated);
    },
    [licenses]
  );

  // Delete License
  const deleteLicense = useCallback(
    (id: string) => {
      const updated = licenses.filter((lic) => lic.id !== id);
      saveLicenses(updated);
    },
    [licenses]
  );

  // Add Master Admin
  const addMasterAdmin = useCallback(
    (name: string, email: string) => {
      const newAdmin: MasterAdminUser = {
        id: 'master-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'master',
        isPrimaryMaster: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [...masterAdmins, newAdmin];
      saveAdmins(updated);
      return newAdmin;
    },
    [masterAdmins]
  );

  // Remove Master Admin
  const removeMasterAdmin = useCallback(
    (id: string) => {
      const target = masterAdmins.find((a) => a.id === id);
      if (target?.isPrimaryMaster) {
        alert('O Master principal não pode ser removido.');
        return;
      }
      const updated = masterAdmins.filter((a) => a.id !== id);
      saveAdmins(updated);
    },
    [masterAdmins]
  );

  // Update Pricing
  const updatePricing = useCallback((updates: Partial<PlanPricingConfig>) => {
    setPricingConfig((prev) => {
      const next = { ...prev, ...updates };
      savePricing(next);
      return next;
    });
  }, []);

  // Calculate Metrics
  const metrics: MasterMetrics = {
    totalRevenue: licenses.reduce((sum, lic) => sum + (lic.paymentStatus === 'paid' ? lic.price : 0), 0),
    monthlyRecurringRevenue: licenses
      .filter((lic) => lic.status === 'active')
      .reduce((sum, lic) => {
        if (lic.planType === 'monthly') return sum + lic.price;
        if (lic.planType === 'annual') return sum + lic.price / 12;
        return sum;
      }, 0),
    activeLicensesCount: licenses.filter((lic) => lic.status === 'active').length,
    trialClientsCount: licenses.filter((lic) => lic.planType === 'trial' && lic.status === 'active').length,
    totalClientsCount: clients.length,
    expiredLicensesCount: licenses.filter((lic) => lic.status === 'expired' || new Date(lic.expirationDate).getTime() < Date.now()).length,
  };

  return {
    licenses,
    masterAdmins,
    clients,
    pricingConfig,
    metrics,
    isLoaded,
    addLicense,
    extendLicense,
    toggleLicenseStatus,
    deleteLicense,
    addMasterAdmin,
    removeMasterAdmin,
    updatePricing,
  };
}
