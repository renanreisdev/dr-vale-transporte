export interface MonthInfo {
  name: string;
  shortName: string;
  index: number;
  daysInMonth: number;
}

export const MONTHS_PT_BR: MonthInfo[] = [
  { name: 'Janeiro', shortName: 'Jan', index: 0, daysInMonth: 31 },
  { name: 'Fevereiro', shortName: 'Fev', index: 1, daysInMonth: 28 },
  { name: 'Março', shortName: 'Mar', index: 2, daysInMonth: 31 },
  { name: 'Abril', shortName: 'Abr', index: 3, daysInMonth: 30 },
  { name: 'Maio', shortName: 'Mai', index: 4, daysInMonth: 31 },
  { name: 'Junho', shortName: 'Jun', index: 5, daysInMonth: 30 },
  { name: 'Julho', shortName: 'Jul', index: 6, daysInMonth: 31 },
  { name: 'Agosto', shortName: 'Ago', index: 7, daysInMonth: 31 },
  { name: 'Setembro', shortName: 'Set', index: 8, daysInMonth: 30 },
  { name: 'Outubro', shortName: 'Out', index: 9, daysInMonth: 31 },
  { name: 'Novembro', shortName: 'Nov', index: 10, daysInMonth: 30 },
  { name: 'Dezembro', shortName: 'Dez', index: 11, daysInMonth: 31 },
];

/**
 * Brazilian National Fixed Holidays
 */
export const BRAZILIAN_NATIONAL_HOLIDAYS = [
  { day: 1, month: 0, name: 'Confraternização Universal' }, // 1 Jan
  { day: 21, month: 3, name: 'Tiradentes' }, // 21 Abr
  { day: 1, month: 4, name: 'Dia do Trabalho' }, // 1 Mai
  { day: 7, month: 8, name: 'Independência do Brasil' }, // 7 Set
  { day: 12, month: 9, name: 'Nossa Senhora Aparecida' }, // 12 Out
  { day: 2, month: 10, name: 'Finados' }, // 2 Nov
  { day: 15, month: 10, name: 'Proclamação da República' }, // 15 Nov
  { day: 20, month: 10, name: 'Dia da Consciência Negra' }, // 20 Nov
  { day: 25, month: 11, name: 'Natal' }, // 25 Dez
];

/**
 * Helper to check if year is leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets days count in a month for a specific year
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  if (monthIndex === 1 && isLeapYear(year)) return 29;
  return MONTHS_PT_BR[monthIndex]?.daysInMonth || 30;
}

export interface PeriodCalendarStats {
  totalCalendarDays: number;
  saturdaysCount: number;
  sundaysCount: number;
  holidaysCount: number;
  sundaysAndHolidaysCount: number;
  weekdaysCount: number; // Mon-Fri excluding holidays
  holidayDetails: { date: number; name: string }[];
}

/**
 * Automatically inspects the calendar for a given start day and end day
 * in a month and year, returning exact counts of Saturdays, Sundays, and Holidays!
 */
export function calculateCalendarStats(
  year: number,
  monthIndex: number,
  startDay: number,
  endDay: number
): PeriodCalendarStats {
  const maxDay = getDaysInMonth(year, monthIndex);
  const start = Math.max(1, Math.min(startDay, maxDay));
  const end = Math.max(start, Math.min(endDay, maxDay));

  let saturdaysCount = 0;
  let sundaysCount = 0;
  let holidaysCount = 0;
  let weekdaysCount = 0;
  const holidayDetails: { date: number; name: string }[] = [];

  for (let day = start; day <= end; day++) {
    const dateObj = new Date(year, monthIndex, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat

    // Check if it's a fixed national holiday
    const holiday = BRAZILIAN_NATIONAL_HOLIDAYS.find(
      (h) => h.day === day && h.month === monthIndex
    );

    if (holiday) {
      holidayDetails.push({ date: day, name: holiday.name });
      holidaysCount++;
    }

    if (dayOfWeek === 0) {
      sundaysCount++;
    } else if (dayOfWeek === 6) {
      saturdaysCount++;
    } else {
      if (!holiday) {
        weekdaysCount++;
      }
    }
  }

  // Sundays + Holidays falling on weekdays
  let sundaysAndHolidaysCount = sundaysCount;
  holidayDetails.forEach((h) => {
    const d = new Date(year, monthIndex, h.date).getDay();
    // Only add holiday if not already Sunday
    if (d !== 0) {
      sundaysAndHolidaysCount++;
    }
  });

  return {
    totalCalendarDays: end - start + 1,
    saturdaysCount,
    sundaysCount,
    holidaysCount,
    sundaysAndHolidaysCount,
    weekdaysCount,
    holidayDetails,
  };
}
