import React, {useState} from 'react';
import {SCUserContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage, useIntl} from 'react-intl';
import {PaymentMethod as StripePaymentMethod} from '@stripe/stripe-js';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {Button, Paper, Stack, styled, Typography} from '@mui/material';
import {AddressElement, PaymentElement, useElements} from '@stripe/react-stripe-js';
import {getDefaultLocale} from '../../utils/payment';
import {useSnackbar} from 'notistack';

const classes = {
  root: `${PREFIX}-root`,
  address: `${PREFIX}-loading`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({
  [`& .${classes.address}`]: {
    padding: 10,
    borderRadius: 5,
    margin: '20px 0px'
  }
}));

export interface UserAddPaymentMethodFormProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  customer: any;
  collectBillingAddress?: boolean;
  handleSuccess?: (paymentMethod: StripePaymentMethod) => void;
  handleClose?: () => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Add Payment Method Form. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserAddPaymentMethodForm} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserAddPaymentMethodForm` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserAddPaymentMethodForm-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UserAddPaymentMethodForm(inProps: UserAddPaymentMethodFormProps): JSX.Element {
  // PROPS
  const props: UserAddPaymentMethodFormProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, customer, collectBillingAddress = false, handleSuccess, handleClose} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [errorMessage, setErrorMessage] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressState, setAddressState] = useState<any>({name: customer.name, address: customer.address});
  const [isEditingBillingAddress, setIsEditingBillingAddress] = React.useState(false);
  const {enqueueSnackbar} = useSnackbar();

  // HOOKS
  const {isPaymentsEnabled, stripePublicKey, stripeConnectedAccountId} = useSCPaymentsEnabled();
  const intl = useIntl();
  const stripePromise: Promise<Stripe> | null =
    isPaymentsEnabled && stripePublicKey && stripeConnectedAccountId && loadStripe
      ? loadStripe(stripePublicKey, {stripeAccount: stripeConnectedAccountId, locale: getDefaultLocale(intl).locale})
      : null;
  const elements = useElements();

  const handleError = (error) => {
    setLoading(false);
    enqueueSnackbar(<FormattedMessage id="ui.common.error" defaultMessage="ui.common.error" />, {
      variant: 'error',
      autoHideDuration: 3000
    });
  };

  const handleSubmit = async (event: {preventDefault: () => void}) => {
    /*

		// We don't want to let default form submission happen here,
		// which would refresh the page.
		event.preventDefault();

		if (!stripePromise || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return null;
		}

		setLoading(true);

		// Trigger form validation and wallet collection
		const {error: submitError} = await elements.submit();
		if (submitError) {
			handleError(submitError);
			return;
		}

		// Create the PaymentMethod using the details collected by the Payment Element
		const {error, paymentMethod} = await stripe.createPaymentMethod({
			elements,
			params: {billing_details: addressState}
		});

		if (error) {
			// This point is only reached if there's an immediate error when
			// creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
			handleError(error);
			return;
		}

		const res = await attachPaymentMethodToCustomer(paymentMethod.id);
		if (res.error) {
			handleError(res.error);
			return;
		}

		handleSuccess?.(paymentMethod as StripePaymentMethod); */
  };

  const onHandleClose = () => {
    handleClose?.();
  };

  const paymentElementOptions = {
    defaultValues: {
      ...(collectBillingAddress && {billingDetails: addressState})
    }
  };

  if (!isPaymentsEnabled || !scUserContext.user) {
    return null;
  }

  return (
    <Root className={classes.root}>
      <form onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} onReady={() => setReady(true)} />
        {collectBillingAddress && (
          <Paper variant="outlined" className={classes.address}>
            {Object.keys(addressState).length && !isEditingBillingAddress ? (
              <>
                <Typography variant="body1">{addressState.name}</Typography>
                <Typography variant="body1">
                  {addressState.address.line1}
                  <br />
                  {addressState.address.line2}
                </Typography>
                <Typography variant="body1">
                  {addressState.address.postal_code} - {addressState.address.city} - {addressState.address.country}
                </Typography>
                <Button sx={{mt: 1}} variant="contained" disabled={!elements} onClick={() => setIsEditingBillingAddress(!isEditingBillingAddress)}>
                  Change
                </Button>
              </>
            ) : (
              <>
                <AddressElement
                  onChange={(event) => {
                    setAddressState(event.value);
                  }}
                  options={{
                    mode: 'billing',
                    defaultValues: addressState
                  }}
                />
                <Button
                  sx={{mt: 1}}
                  variant="contained"
                  disabled={!elements || loading || !ready}
                  onClick={() => setIsEditingBillingAddress(!isEditingBillingAddress)}>
                  <FormattedMessage id="ui.userAddPaymentMethodForm.useDefaultMethod" defaultMessage="ui.userAddPaymentMethodForm.useDefaultMethod" />
                </Button>
              </>
            )}
          </Paper>
        )}
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} mt={3}>
          <Button onClick={onHandleClose} variant="outlined">
            <FormattedMessage id="ui.userAddPaymentMethodForm.cancelButton" defaultMessage="ui.userAddPaymentMethodForm.cancelButton" />
          </Button>
          <Button disabled={!ready} loading={loading} type="submit" variant="contained">
            <FormattedMessage id="ui.userAddPaymentMethodForm.addButton" defaultMessage="ui.userAddPaymentMethodForm.addButton" />
          </Button>
        </Stack>
        {/* Show error message to your customers */}
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </Root>
  );
}
