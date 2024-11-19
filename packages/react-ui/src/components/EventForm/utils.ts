import {addDays, addHours} from 'date-fns';

export function getNewDate(date?: string | Date) {
  if (date) {
    if (typeof date === 'string') {
      return new Date(date);
    }

    return date;
  }

  return new Date();
}

export function getLaterHoursDate(hours: number, date?: Date) {
  return addHours(getNewDate(date), hours);
}

export function getLaterDaysDate(days: number, date?: Date) {
  return addDays(getNewDate(date), days);
}

export const combineDateAndTime = (date: Date, time: Date) => {
  const combined = date;

  combined.setHours(time.getHours());
  combined.setMinutes(time.getMinutes());
  combined.setSeconds(time.getSeconds());
  combined.setMilliseconds(time.getMilliseconds());

  return combined.toISOString();
};
