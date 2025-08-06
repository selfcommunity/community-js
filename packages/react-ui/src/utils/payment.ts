import {SCThemeType} from '@selfcommunity/react-core';
import {Appearance} from '@stripe/stripe-js';
import {IntlShape, useIntl} from 'react-intl';
import {SCLanguageType, SCPaymentPrice, SCPaymentPriceCurrencyType} from '@selfcommunity/types';

const getDefaultAppearanceStyle = (theme: SCThemeType): {appearance: Appearance} => ({
  appearance: {
    variables: {
      borderRadius: '5px',
      colorPrimary: theme.palette.primary.main,
      colorBackground: '#FFF',
      colorWarning: theme.palette.secondary.main,
      colorDanger: theme.palette.secondary.main,
      spacingUnit: '6px'
    },
    rules: {
      '.Input': {
        borderWidth: '2px',
        borderColor: theme.palette.grey['300'],
        boxShadow: 'unset',
        boxSizing: 'border-box'
      },
      '.Input:hover': {
        boxShadow: 'unset'
      },
      '.Input:focus': {
        // outline: 0,
        boxShadow: 'unset',
        borderColor: theme.palette.primary.main
        // borderWidth: '0px',
        // boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
      },
      '.Input--invalid': {
        borderWidth: '2px',
        boxShadow: 'unset'
      }
    }
  }
});

const getDefaultLocale = (intl: IntlShape): {locale: SCLanguageType} => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {locale: intl.locale};
};

const getDefaultPaymentMethodConfiguration = (): {
  payment_method_configuration?: string;
  paymentMethodTypes?: string[];
} => ({
  // payment_method_configuration: SCPaymentMethodConfiguration
  paymentMethodTypes: ['card']
});

const getConvertedAmount = (paymentPrice: SCPaymentPrice): string | null => {
  if (!paymentPrice) return;
  return `${(paymentPrice.unit_amount / 100).toFixed(2)}${paymentPrice.currency === SCPaymentPriceCurrencyType.EUR ? '€' : '$'}`;
};

const getRecurringConvertedAmount = (paymentPrice: SCPaymentPrice, intl: IntlShape): string | null => {
  if (!paymentPrice) return;
  const amount = (paymentPrice.unit_amount / 100).toFixed(2);
  const currencySymbol = paymentPrice.currency === SCPaymentPriceCurrencyType.EUR ? '€' : '$';
  const interval = paymentPrice.recurring_interval
    ? ` / ${intl.formatMessage({
        id: `ui.paymentProduct.price.${paymentPrice.recurring_interval}`
      })}`
    : '';

  return `${amount}${currencySymbol}${interval}`;
};

export {getDefaultAppearanceStyle, getDefaultLocale, getDefaultPaymentMethodConfiguration, getConvertedAmount, getRecurringConvertedAmount};
