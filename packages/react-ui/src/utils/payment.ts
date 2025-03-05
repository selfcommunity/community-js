import {SCThemeType} from '@selfcommunity/react-core';
import {Appearance} from '@stripe/stripe-js';
import {IntlShape} from 'react-intl';
import {SCPaymentPriceCurrencyType} from '@selfcommunity/types';

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

const getDefaultLocale = (intl: IntlShape): {} => ({
  locale: intl.locale
});

const getDefaultPaymentMethodConfiguration = (): {
  payment_method_configuration?: string;
  paymentMethodTypes?: string[];
} => ({
  // payment_method_configuration: SCPaymentMethodConfiguration
  paymentMethodTypes: ['card']
});

const getConvertedAmount = (amountInCents: number, currency?: SCPaymentPriceCurrencyType) => {
  const amountInEuro = amountInCents / 100;
  const formattedAmount = amountInEuro.toFixed(2);
  return formattedAmount + currency ? (currency === SCPaymentPriceCurrencyType.EUR ? '€' : '$') : ' €';
};

export {getDefaultAppearanceStyle, getDefaultLocale, getDefaultPaymentMethodConfiguration, getConvertedAmount};
