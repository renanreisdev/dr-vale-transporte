import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Syncs current calculation period to Supabase if configured
 */
export async function syncPeriodToSupabase(periodData: any, rowsData: any[]) {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase não configurado. Dados salvos localmente.' };
  }

  try {
    const { data: period, error: pError } = await supabase
      .from('vt_periods')
      .upsert({
        id: periodData.id,
        year: periodData.year,
        month: periodData.month,
        month_index: periodData.monthIndex,
        start_date: periodData.startDate,
        end_date: periodData.endDate,
        sundays_holidays: periodData.sundaysAndHolidays,
        unit_price: periodData.unitPrice,
        company_name: periodData.companyName,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (pError) throw pError;

    // Sync rows
    const rowsToUpsert = rowsData.map((r) => ({
      id: r.id,
      period_id: periodData.id,
      name: r.name,
      vouchers_weekday: r.vouchersPerWeekday,
      vouchers_saturday: r.vouchersPerSaturday,
      saturdays_worked: r.saturdaysWorked,
      total_vouchers: r.totalVouchers,
      previous_days_balance: r.previousDaysBalance,
      previous_amount_balance: r.previousAmountBalance,
      balance_adjustment: r.balanceAdjustment,
      net_amount: r.netAmountToCredit,
      updated_at: new Date().toISOString(),
    }));

    const { error: rError } = await supabase
      .from('vt_calculations')
      .upsert(rowsToUpsert);

    if (rError) throw rError;

    return { success: true, message: 'Sincronizado com o Supabase com sucesso!' };
  } catch (error: any) {
    console.error('Erro na sincronização com Supabase:', error);
    return { success: false, message: error.message || 'Erro ao sincronizar com nuvem.' };
  }
}
