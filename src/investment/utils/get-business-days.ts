import Holidays from 'date-holidays';
import { eachDayOfInterval, isWeekend } from 'date-fns';

export function getBusinessDays(startDate: Date, endDate: Date): number {
  if (startDate >= endDate) return 0;

  const hd = new Holidays('BR');
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // We exclude the start date from the count if we want the number of full days elapsed.
  // Actually, eachDayOfInterval includes both start and end dates.
  // Standard financial math counts the number of overnight periods.
  let businessDays = 0;
  for (let i = 1; i < days.length; i++) {
    const day = days[i];
    if (!isWeekend(day) && !hd.isHoliday(day)) {
      businessDays++;
    }
  }
  return businessDays;
}
