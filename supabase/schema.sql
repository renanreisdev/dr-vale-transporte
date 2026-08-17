-- =========================================================
-- SCHEMA SUPABASE: DR VALE (Gestão de Vale Transporte)
-- =========================================================

-- 1. Tabela de Empresas
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  email TEXT,
  responsible_name TEXT,
  responsible_role TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Colaboradores
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  role TEXT,
  cpf TEXT,
  active BOOLEAN DEFAULT TRUE,
  default_vouchers_weekday NUMERIC(5,2) DEFAULT 2,
  default_vouchers_saturday NUMERIC(5,2) DEFAULT 0,
  default_saturdays_count NUMERIC(5,2) DEFAULT 0,
  custom_unit_price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Períodos de Cálculo de VT
CREATE TABLE IF NOT EXISTS vt_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month TEXT NOT NULL,
  month_index INTEGER NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  sundays_holidays INTEGER NOT NULL DEFAULT 0,
  saturdays_in_period INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC(10,2) NOT NULL,
  company_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Linhas de Cálculo de VT por Período
CREATE TABLE IF NOT EXISTS vt_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID REFERENCES vt_periods(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  vouchers_weekday NUMERIC(5,2) DEFAULT 0,
  vouchers_saturday NUMERIC(5,2) DEFAULT 0,
  saturdays_worked NUMERIC(5,2) DEFAULT 0,
  total_vouchers NUMERIC(10,2) DEFAULT 0,
  previous_days_balance NUMERIC(10,2) DEFAULT 0,
  previous_amount_balance NUMERIC(10,2) DEFAULT 0,
  balance_adjustment NUMERIC(10,2) DEFAULT 0,
  net_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Chaves de Licença e Ativações
CREATE TABLE IF NOT EXISTS license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT UNIQUE NOT NULL,
  license_type TEXT NOT NULL CHECK (license_type IN ('trial', 'monthly', 'annual', 'lifetime')),
  client_identifier TEXT NOT NULL,
  client_email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expiration_date TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para alta performance
CREATE INDEX IF NOT EXISTS idx_vt_periods_company ON vt_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_vt_calculations_period ON vt_calculations(period_id);
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_license_keys_key ON license_keys(license_key);

-- Habilitar Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vt_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE vt_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para demonstração / usuários autenticados
CREATE POLICY "Permitir leitura para todos" ON companies FOR ALL USING (true);
CREATE POLICY "Permitir leitura para todos" ON employees FOR ALL USING (true);
CREATE POLICY "Permitir leitura para todos" ON vt_periods FOR ALL USING (true);
CREATE POLICY "Permitir leitura para todos" ON vt_calculations FOR ALL USING (true);
CREATE POLICY "Permitir leitura para todos" ON license_keys FOR ALL USING (true);
