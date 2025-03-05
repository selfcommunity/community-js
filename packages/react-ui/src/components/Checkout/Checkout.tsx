import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from '@stripe/react-stripe-js';
import {loadStripe, Stripe, StripeElementsOptions} from '@stripe/stripe-js';
import {PaymentApiClient, SCPaginatedResponse, SuggestionService} from '@selfcommunity/api-services';
import CheckoutSkeleton from './Skeleton';
import {PREFIX} from './constants';
import {SCCategoryType, SCContentType, SCPurchasableContent} from '@selfcommunity/types/src/types';
import {IntlShape, useIntl} from 'react-intl';
import {getDefaultAppearanceStyle, getDefaultLocale} from '../../utils/payment';
import {SCPreferences, SCPreferencesContextType, SCThemeType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {actionWidgetTypes} from '../../utils/widget';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCEventTemplateType} from '@selfcommunity/react-ui';
import Event from '../Event';

const classes = {
  root: `${PREFIX}-root`,
  event: `${PREFIX}-event`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({
  position: 'relative',
  [`& .${classes.event}`]: {
    [theme.breakpoints.down(1024)]: {
      display: 'none'
    },
    maxWidth: 300,
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(10)
  }
}));

export interface CheckoutProps {
  className?: string;
  clientSecret?: string;
  contentType?: SCContentType;
  contentId?: number;
  content?: SCPurchasableContent;
  priceId?: number;
}

export default function Checkout(inProps: CheckoutProps) {
  // PROPS
  const props: CheckoutProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentType, contentId, content, priceId, ...rest} = props;

  const {preferences}: SCPreferencesContextType = useSCPreferences();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  // MEMO
  const stripePublicKey = useMemo(
    () => preferences && SCPreferences.STATIC_STRIPE_PUBLIC_KEY in preferences && preferences[SCPreferences.STATIC_STRIPE_PUBLIC_KEY].value,
    [preferences]
  );
  const stripeConnectedAccountId = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_STRIPE_CONNECTED_ACCOUNT_ID in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_STRIPE_CONNECTED_ACCOUNT_ID].value,
    [preferences]
  );
  console.log(stripePublicKey);
  const stripePromise: Promise<Stripe> | null =
    stripePublicKey && stripeConnectedAccountId ? loadStripe(stripePublicKey, {stripeAccount: stripeConnectedAccountId}) : null;

  // CONTEXT
  const scUserContext = useSCUser();
  const theme: SCThemeType = useTheme<SCThemeType>();
  const intl: IntlShape = useIntl();

  // STATE
  const [clientSecret, setClientSecret] = useState<string | null>(props.clientSecret);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    // TODO: During session create check customer_email or customer to force email prefilled and disabled changes
    if (!loading) {
      console.log('fetching client secret...');
      setInitialized(true);
      setLoading(true);
      PaymentApiClient.checkoutCreateSession({
        content_type: contentType,
        content_id: content ? content.id : contentId,
        payment_price_id: priceId
      })
        .then((r) => {
          console.log(r);
          setClientSecret(r.client_secret);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching session client secret:', error);
        });
    }
  }, [contentType, contentId, content, priceId, loading]);

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user && contentType && (contentId || content) && priceId && !clientSecret && Boolean(stripePromise) && !initialized) {
      _t = setTimeout(fetchClientSecret);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, clientSecret, stripePromise, contentType, contentId, content, priceId, loading, initialized]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise || !clientSecret || !scUserContext.user) {
    return <CheckoutSkeleton />;
  }

  const elementsOptions: StripeElementsOptions = {
    ...getDefaultAppearanceStyle(theme),
    ...{clientSecret, customer_email: scUserContext.user.email},
    ...getDefaultLocale(intl)
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret}}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
        <Event eventId={1} template={SCEventTemplateType.PREVIEW} actions={<></>} variant="outlined" className={classes.event} />
      </div>
    </Root>
  );
}
