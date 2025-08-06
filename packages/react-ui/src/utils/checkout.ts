import {SCPaymentRecurringInterval} from '@selfcommunity/types';

export function getPaymentRecurringLabel(interval: SCPaymentRecurringInterval | undefined, locale = 'en'): string {
  const labels: Record<string, Record<SCPaymentRecurringInterval, string>> = {
    ['en']: {
      [SCPaymentRecurringInterval.WEEK]: 'weekly',
      [SCPaymentRecurringInterval.MONTH]: 'monthly',
      [SCPaymentRecurringInterval.YEAR]: 'yearly'
    },
    ['it']: {
      [SCPaymentRecurringInterval.WEEK]: 'settimanale',
      [SCPaymentRecurringInterval.MONTH]: 'mensile',
      [SCPaymentRecurringInterval.YEAR]: 'annuale'
    }
  };

  if (!interval || !(interval in labels[locale])) {
    return interval ?? '';
  }

  return labels[locale][interval];
}
