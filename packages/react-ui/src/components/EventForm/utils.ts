import { addDays, addHours } from 'date-fns';

export function getNewDate(date?: string) {
  if (date) {
    return new Date(date);
  }

  return new Date();
}

export function getLaterHoursDate(h: number) {
  return addHours(getNewDate(), h);
}

export function getLaterDaysDate(d: number) {
  return addDays(getNewDate(), d);
}

export const combineDateAndTime = (date: Date, time: Date) => {
  const combined = date;

  combined.setHours(time.getHours());
  combined.setMinutes(time.getMinutes());
  combined.setSeconds(time.getSeconds());
  combined.setMilliseconds(time.getMilliseconds());

  return combined.toISOString();
};
