import { LicenseStatus } from '@/types/vt';

const TRIAL_STORAGE_KEY = 'dr_vale_trial_data_v1';
const LICENSE_STORAGE_KEY = 'dr_vale_license_key_v1';
const DEFAULT_TRIAL_DAYS = 14;
const SECRET_SIGNING_SALT = 'DR_VALE_SAAS_AUTH_SECRET_2026';

export interface TrialData {
  firstAccessTimestamp: number;
  trialDurationDays: number;
  companyName: string;
}

export interface ParsedLicense {
  isValid: boolean;
  type: 'trial' | 'monthly' | 'annual' | 'lifetime';
  expirationDate?: string;
  licensedTo?: string;
  message?: string;
}

/**
 * Simple deterministic hash for checksum validation
 */
function generateChecksum(data: string): string {
  let hash = 5381;
  const str = data + SECRET_SIGNING_SALT;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
}

/**
 * Generates an official License Key for clients (used by the software owner)
 * e.g., DRVALE-LIF-SIDIAL-20271231-A9F3X2
 */
export function generateLicenseKey(
  type: 'T30' | 'M01' | 'A01' | 'LIF',
  clientIdentifier: string, // CNPJ or Company Name
  expirationDateStr?: string // YYYY-MM-DD (optional for lifetime)
): string {
  const cleanId = (clientIdentifier || 'CLIENTE').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  const expCode = type === 'LIF' ? 'LIFETIME' : (expirationDateStr || '20261231').replace(/-/g, '');
  const payload = `DRVALE-${type}-${cleanId}-${expCode}`;
  const checksum = generateChecksum(payload);
  return `${payload}-${checksum}`;
}

/**
 * Validates a License Key
 */
export function validateLicenseKey(licenseKey: string, companyIdentifier?: string): ParsedLicense {
  if (!licenseKey) {
    return { isValid: false, type: 'trial', message: 'Nenhuma chave fornecida.' };
  }

  const parts = licenseKey.trim().toUpperCase().split('-');
  if (parts.length !== 5 || parts[0] !== 'DRVALE') {
    return { isValid: false, type: 'trial', message: 'Formato de chave inválido.' };
  }

  const [_, typeCode, clientTag, expCode, checksum] = parts;
  const expectedPayload = `DRVALE-${typeCode}-${clientTag}-${expCode}`;
  const validChecksum = generateChecksum(expectedPayload);

  if (checksum !== validChecksum) {
    return { isValid: false, type: 'trial', message: 'Assinatura criptográfica da chave inválida.' };
  }

  let type: 'trial' | 'monthly' | 'annual' | 'lifetime' = 'lifetime';
  if (typeCode === 'T30') type = 'trial';
  else if (typeCode === 'M01') type = 'monthly';
  else if (typeCode === 'A01') type = 'annual';
  else if (typeCode === 'LIF') type = 'lifetime';

  if (typeCode !== 'LIF') {
    // Parse YYYYMMDD
    const year = parseInt(expCode.substring(0, 4), 10);
    const month = parseInt(expCode.substring(4, 6), 10) - 1;
    const day = parseInt(expCode.substring(6, 8), 10);
    const expDate = new Date(year, month, day, 23, 59, 59);

    if (isNaN(expDate.getTime())) {
      return { isValid: false, type, message: 'Data de expiração da chave corrompida.' };
    }

    if (Date.now() > expDate.getTime()) {
      return {
        isValid: false,
        type,
        expirationDate: expDate.toISOString(),
        message: `Esta licença expirou em ${expDate.toLocaleDateString('pt-BR')}.`,
      };
    }

    return {
      isValid: true,
      type,
      expirationDate: expDate.toISOString(),
      licensedTo: clientTag,
    };
  }

  return {
    isValid: true,
    type: 'lifetime',
    licensedTo: clientTag,
  };
}

/**
 * Gets or initializes the current user's trial / license status
 */
export function getLicenseStatus(): LicenseStatus {
  if (typeof window === 'undefined') {
    return {
      isLicensed: true,
      isTrial: false,
      trialDaysRemaining: 14,
      trialStartDate: new Date().toISOString(),
      trialEndDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      licenseType: 'trial',
      features: {
        maxEmployees: -1,
        exportPdf: true,
        exportExcel: true,
        cloudSync: true,
        watermark: false,
      },
    };
  }

  // 1. Check if user has an activated license key
  const savedKey = localStorage.getItem(LICENSE_STORAGE_KEY);
  if (savedKey) {
    const parsed = validateLicenseKey(savedKey);
    if (parsed.isValid) {
      return {
        isLicensed: true,
        isTrial: false,
        trialDaysRemaining: 999,
        trialStartDate: new Date().toISOString(),
        trialEndDate: parsed.expirationDate || new Date(2099, 0, 1).toISOString(),
        licenseKey: savedKey,
        licensedTo: parsed.licensedTo,
        licenseType: parsed.type,
        expirationDate: parsed.expirationDate,
        features: {
          maxEmployees: -1,
          exportPdf: true,
          exportExcel: true,
          cloudSync: true,
          watermark: false,
        },
      };
    }
  }

  // 2. Otherwise calculate Trial status
  let trialRaw = localStorage.getItem(TRIAL_STORAGE_KEY);
  let trialData: TrialData;

  if (!trialRaw) {
    trialData = {
      firstAccessTimestamp: Date.now(),
      trialDurationDays: DEFAULT_TRIAL_DAYS,
      companyName: 'Modo Demonstração',
    };
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(trialData));
  } else {
    try {
      trialData = JSON.parse(trialRaw);
    } catch {
      trialData = {
        firstAccessTimestamp: Date.now(),
        trialDurationDays: DEFAULT_TRIAL_DAYS,
        companyName: 'Modo Demonstração',
      };
    }
  }

  const elapsedMs = Date.now() - trialData.firstAccessTimestamp;
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  const remainingDays = Math.max(0, Math.ceil(trialData.trialDurationDays - elapsedDays));
  const isTrialActive = remainingDays > 0;

  const trialStart = new Date(trialData.firstAccessTimestamp);
  const trialEnd = new Date(trialData.firstAccessTimestamp + trialData.trialDurationDays * 86400000);

  return {
    isLicensed: isTrialActive,
    isTrial: true,
    trialDaysRemaining: remainingDays,
    trialStartDate: trialStart.toISOString(),
    trialEndDate: trialEnd.toISOString(),
    licenseType: 'trial',
    features: {
      maxEmployees: -1,
      exportPdf: isTrialActive,
      exportExcel: isTrialActive,
      cloudSync: true,
      watermark: !isTrialActive,
    },
  };
}

/**
 * Saves and activates a new license key in localStorage
 */
export function activateLicense(licenseKey: string): { success: boolean; message: string; license?: ParsedLicense } {
  const result = validateLicenseKey(licenseKey);
  if (!result.isValid) {
    return { success: false, message: result.message || 'Chave de licença inválida.' };
  }

  localStorage.setItem(LICENSE_STORAGE_KEY, licenseKey.trim().toUpperCase());
  return { success: true, message: 'Licença ativada com sucesso!', license: result };
}

/**
 * Resets license to trial mode (useful for testing or deregistering)
 */
export function removeLicense(): void {
  localStorage.removeItem(LICENSE_STORAGE_KEY);
}

/**
 * Extends the demo trial for testing purposes
 */
export function extendTrialDays(days: number): void {
  const trialRaw = localStorage.getItem(TRIAL_STORAGE_KEY);
  if (trialRaw) {
    try {
      const data = JSON.parse(trialRaw);
      data.trialDurationDays += days;
      localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }
}
