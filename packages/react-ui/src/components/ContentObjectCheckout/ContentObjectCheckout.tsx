import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from '@stripe/react-stripe-js';
import {loadStripe, Stripe, StripeElementsOptions} from '@stripe/stripe-js';
import {PaymentApiClient} from '@selfcommunity/api-services';
import ContentObjectCheckoutSkeleton from './Skeleton';
import {PREFIX} from './constants';
import {SCContentType} from '@selfcommunity/types/src/types';
import {IntlShape, useIntl} from 'react-intl';
import {getDefaultAppearanceStyle, getDefaultLocale} from '../../utils/payment';
import {SCPreferences, SCPreferencesContextType, SCThemeType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface ContentObjectCheckoutProps {
  className?: string;
  clientSecret?: string;
  contentType: SCContentType;
  contentId: number;
  priceId?: string;
}

export default function ContentObjectCheckout(inProps: ContentObjectCheckoutProps) {
  // PROPS
  const props: ContentObjectCheckoutProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentType, contentId, priceId, ...rest} = props;

  const {preferences}: SCPreferencesContextType = useSCPreferences();

  // MEMO
  const stripePublicKey = useMemo(
    () => preferences && SCPreferences.STATIC_STRIPE_PUBLIC_KEY in preferences && preferences[SCPreferences.STATIC_STRIPE_PUBLIC_KEY].value,
    [preferences]
  );
  const stripePromise: Promise<Stripe> | null = stripePublicKey ? loadStripe(stripePublicKey) : null;

  // CONTEXT
  const scUserContext = useSCUser();
  const theme: SCThemeType = useTheme<SCThemeType>();
  const intl: IntlShape = useIntl();

  // STATE
  const [clientSecret, setClientSecret] = useState<string | null>(props.clientSecret);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    // TODO: During session create check customer_email or customer to force email prefilled and disabled changes
    PaymentApiClient.checkoutCreateSession({
      content_type: contentType,
      content_id: contentId,
      price_id: priceId
    })
      .then((r) => setClientSecret(r.client_secret))
      .catch((error) => {
        console.error('Error fetching session client secret:', error);
      });
  }, [contentType, contentId, priceId]);

  useEffect(() => {
    if (contentType && contentId && priceId && !clientSecret && Boolean(stripePromise)) {
      fetchClientSecret();
    }
  }, [fetchClientSecret, stripePromise]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise || !clientSecret || !scUserContext.user) {
    return <ContentObjectCheckoutSkeleton />;
  }

  const elementsOptions: StripeElementsOptions = {
    ...getDefaultAppearanceStyle(theme),
    ...{clientSecret, customer_email: scUserContext.user.email},
    ...getDefaultLocale(intl)
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <div id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={elementsOptions}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </Root>
  );
}
