export enum StripeCurrency {
  EUR = 'eur',
  USD = 'usd',
  GBP = 'gbp',
  JPY = 'jpy',
  CAD = 'cad',
  AUD = 'aud',
  CHF = 'chf',
  CNY = 'cny',
  INR = 'inr',
  BRL = 'brl'
}

export const StripeCurrencySymbol = {
  [StripeCurrency.EUR]: '€',
  [StripeCurrency.USD]: '$',
  [StripeCurrency.GBP]: '£',
  [StripeCurrency.JPY]: '¥',
  [StripeCurrency.CAD]: 'C$',
  [StripeCurrency.AUD]: 'A$',
  [StripeCurrency.CHF]: 'CHF',
  [StripeCurrency.CNY]: '¥',
  [StripeCurrency.INR]: '₹',
  [StripeCurrency.BRL]: 'R$'
};

export const StripeCurrencyRightSymbol = [StripeCurrency.EUR];
