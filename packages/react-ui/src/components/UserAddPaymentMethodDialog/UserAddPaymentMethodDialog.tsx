import React, {useEffect, useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {SCThemeType, SCUserContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage, useIntl} from 'react-intl';
import {PaymentMethod as StripePaymentMethod} from '@stripe/stripe-js';
import {loadStripe, Stripe, StripeElementsOptions} from '@stripe/stripe-js';
import {StripeCurrency} from '../../types/payment';
import {Box, CircularProgress} from '@mui/material';
import {Elements} from '@stripe/react-stripe-js';
import {getDefaultAppearanceStyle, getDefaultLocale} from '../../utils/payment';
import UserAddPaymentMethodForm from '../UserAddPaymentMethodForm';

const classes = {
  root: `${PREFIX}-root`,
  loading: `${PREFIX}-loading`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({
  [`& .MuiDialogContent-root`]: {
    overflowX: 'hidden'
  },
  [`& .${classes.loading}`]: {
    marginTop: '200px'
  }
}));

export interface UserAddPaymentMethodDialogProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Callback handle address
   * @param address
   */
  handlePaymentMethod?: (paymentMethod: StripePaymentMethod) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Add Payment Method Dialog. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserAddPaymentMethodDialog} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserAddPaymentMethodDialog` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserAddPaymentMethodDialog-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UserAddPaymentMethodDialog(inProps: UserAddPaymentMethodDialogProps): JSX.Element {
  // PROPS
  const props: UserAddPaymentMethodDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, handlePaymentMethod, open = false, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [isLoadingInit, setIsLoadingInit] = React.useState(true);
  const [customer, setCustomer] = useState<any | null>(null);

  // HOOKS
  const {isPaymentsEnabled, stripePublicKey, stripeConnectedAccountId} = useSCPaymentsEnabled();
  const intl = useIntl();
  const stripePromise: Promise<Stripe> | null =
    isPaymentsEnabled && stripePublicKey && stripeConnectedAccountId && loadStripe
      ? loadStripe(stripePublicKey, {stripeAccount: stripeConnectedAccountId, locale: getDefaultLocale(intl).locale})
      : null;
  const theme = useTheme<SCThemeType>();

  const elementsOptions: StripeElementsOptions = {
    ...{mode: 'setup', currency: StripeCurrency.EUR, paymentMethodCreation: 'manual', loader: 'always'},
    ...getDefaultAppearanceStyle(theme),
    ...getDefaultLocale(intl)
  };

  const handleClose = () => {
    handlePaymentMethod?.(null);
  };

  const handleSuccess = (paymentMethod: StripePaymentMethod) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handlePaymentMethod?.(paymentMethod);
  };

  useEffect(() => {
    /* getAccountCustomer().then((customer) => {
			setCustomer(customer);
			setIsLoadingInit(false);
		}); */
  }, []);

  if (!isPaymentsEnabled || !scUserContext.user) {
    return null;
  }

  return (
    <Root title={<FormattedMessage defaultMessage="ui.userAddPaymentMethodDialog.title" id="ui.userAddPaymentMethodDialog.title" />} open={open}>
      {isLoadingInit ? (
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      ) : (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <UserAddPaymentMethodForm customer={customer} handleSuccess={handleSuccess} handleClose={handleClose} />
        </Elements>
      )}
    </Root>
  );
}
