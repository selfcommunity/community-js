import React, {useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {Button} from '@mui/material';
import {SCThemeType, SCUserContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage, useIntl} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import {AddressElement, Elements} from '@stripe/react-stripe-js';
import {loadStripe, Stripe, StripeElementsOptions} from '@stripe/stripe-js';
import {getDefaultAppearanceStyle, getDefaultLocale} from '@selfcommunity/react-ui';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserChangeAddressDialogProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Default address
   */
  defaultAddress: Record<string, string>;

  /**
   * Callback handle address
   * @param address
   */
  handleAddress?: (address: Record<string, string>) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Change Address Dialog. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserChangeAddressDialog} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserPaymentMethods` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserPaymentMethods-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UserChangeAddressDialog(inProps: UserChangeAddressDialogProps): JSX.Element {
  // PROPS
  const props: UserChangeAddressDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, defaultAddress = {}, handleAddress, open = false, ...rest} = props;

  // STATE
  const [addressState, setAddressState] = useState<any>(defaultAddress.billing_details);
  const [loading, setLoading] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {isPaymentsEnabled, stripePublicKey, stripeConnectedAccountId} = useSCPaymentsEnabled();
  const intl = useIntl();
  const stripePromise: Promise<Stripe> | null =
    isPaymentsEnabled && stripePublicKey && stripeConnectedAccountId && loadStripe
      ? loadStripe(stripePublicKey, {stripeAccount: stripeConnectedAccountId, locale: getDefaultLocale(intl).locale})
      : null;
  const theme = useTheme<SCThemeType>();

  const elementsOptions: StripeElementsOptions = {
    ...getDefaultAppearanceStyle(theme),
    ...getDefaultLocale(intl)
  };

  const handleChangeAddress = (event: {value: any}) => {
    setAddressState(event.value);
  };

  const handleSave = () => {
    setLoading(true);
    handleAddress?.(addressState);
  };

  const handleClose = () => {
    handleAddress?.(addressState);
  };

  if (!isPaymentsEnabled || !scUserContext.user) {
    return null;
  }

  return (
    <Root
      className={classNames(classes.root, className)}
      title={<FormattedMessage defaultMessage="ui.userChangeAddressDialog.title" id="component.userChangeAddressDialog.title" />}
      open={open}
      actions={
        <>
          <Button variant={'outlined'} onClick={handleClose}>
            <FormattedMessage defaultMessage="ui.userChangeAddressDialog.btnClose" id="component.userChangeAddressDialog.btnClose" />
          </Button>
          <LoadingButton loading={loading} disabled={loading} variant={'contained'} onClick={handleSave}>
            <FormattedMessage defaultMessage="ui.userChangeAddressDialog.btnSave" id="component.userChangeAddressDialog.btnSave" />
          </LoadingButton>
        </>
      }
      {...rest}>
      <Elements stripe={stripePromise} options={elementsOptions}>
        <AddressElement
          onChange={handleChangeAddress}
          options={{
            mode: 'billing',
            defaultValues: addressState
          }}
        />
      </Elements>
    </Root>
  );
}
