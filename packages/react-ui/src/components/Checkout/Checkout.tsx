import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Box, Button, Icon, styled, Typography} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from '@stripe/react-stripe-js';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {PaymentApiClient} from '@selfcommunity/api-services';
import CheckoutSkeleton from './Skeleton';
import {PREFIX} from './constants';
import {SCCheckoutSessionUIMode, SCContentType, SCPaymentOrder, SCPurchasableContent} from '@selfcommunity/types';
import {FormattedMessage, IntlShape, useIntl} from 'react-intl';
import {getDefaultLocale} from '../../utils/payment';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import Event from '../Event';
import Category from '../Category';
import Course from '../Course';
import Group from '../Group';
import {SCEventTemplateType} from '../../types/event';
import {SCCourseTemplateType} from '../../types/course';
import PaymentOrder from '../PaymentOrder';
import CheckoutHeaderInfoWidget from './CheckoutHeaderInfoWidget';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  contentObject: `${PREFIX}-content-object`,
  contentDesc: `${PREFIX}-content-desc`,
  contentCoverage: `${PREFIX}-content-coverage`,
  checkout: `${PREFIX}-checkout`,
  object: `${PREFIX}-object`,
  paymentOrder: `${PREFIX}-payment-order`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(() => ({}));

export interface CheckoutProps {
  className?: string;
  clientSecret?: string;
  contentType?: SCContentType;
  contentId?: number;
  content?: SCPurchasableContent;
  priceId?: number;
  returnUrl?: string;
  successUrl?: string;
  uiMode?: SCCheckoutSessionUIMode;
  onComplete?: () => void;
}

export default function Checkout(inProps: CheckoutProps) {
  // PROPS
  const props: CheckoutProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, clientSecret, contentType, contentId, content, priceId, returnUrl, successUrl, uiMode, onComplete, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [paymentOrder, setPaymentOrder] = useState<SCPaymentOrder>(null);

  // CONTEXT
  const scUserContext = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const appUrl = useMemo(
    () => scPreferencesContext.preferences && scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_APP_URL].value,
    [scPreferencesContext.preferences]
  );
  const intl: IntlShape = useIntl();

  // HOOKS
  const {isPaymentsEnabled, stripePublicKey, stripeConnectedAccountId} = useSCPaymentsEnabled();
  const stripePromise: Promise<Stripe> | null =
    isPaymentsEnabled && stripePublicKey && stripeConnectedAccountId && loadStripe
      ? loadStripe(stripePublicKey, {stripeAccount: stripeConnectedAccountId, locale: getDefaultLocale(intl).locale})
      : null;

  // STATE
  const [clientSecretKey, setClientSecretKey] = useState<string | null>(clientSecret);

  // CONST
  const isContentObject = useMemo(() => contentType && contentId !== undefined, [contentType, contentId]);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    if (!loading) {
      setInitialized(true);
      setLoading(true);
      PaymentApiClient.getPaymentContentStatus({content_id: contentId, content_type: contentType})
        .then((data) => {
          if (!data.payment_order) {
            PaymentApiClient.checkoutCreateSession({
              content_type: contentType,
              content_id: content ? content.id : contentId,
              payment_price_id: priceId,
              ...(returnUrl && {return_url: returnUrl}),
              ...(successUrl && {success_url: successUrl}),
              ...(uiMode && {ui_mode: uiMode})
            }).then((r) => {
              setClientSecretKey(r.client_secret);
              setLoading(false);
            });
          } else {
            setPaymentOrder(data.payment_order);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching session client secret:', error);
        });
    }
  }, [contentType, contentId, content, priceId, loading]);

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user && contentType && (contentId || content) && priceId && !clientSecretKey && Boolean(stripePromise) && !initialized) {
      _t = setTimeout(fetchClientSecret);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, clientSecretKey, stripePromise, contentType, contentId, content, priceId, loading, initialized]);

  // Payment provider options
  const providerOptions = useMemo(
    () => ({
      clientSecret: clientSecretKey,
      ...(onComplete && {onComplete})
      // ...(onShippingDetailsChange && {onShippingDetailsChange})
    }),
    [clientSecretKey, onComplete]
  );

  if (!isPaymentsEnabled) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise || (!clientSecretKey && !paymentOrder) || !scUserContext.user) {
    return <CheckoutSkeleton />;
  }

  const renderContentObject = () => {
    let _c = null;
    if (isContentObject) {
      switch (contentType) {
        case SCContentType.EVENT:
          _c = (
            <Event
              eventId={contentId}
              template={SCEventTemplateType.PREVIEW}
              actions={<></>}
              hideEventParticipants
              hideEventPlanner
              variant="outlined"
              className={classes.object}
            />
          );
          break;
        case SCContentType.CATEGORY:
          _c = <Category categoryId={contentId} actions={<></>} variant="outlined" className={classes.object} />;
          break;
        case SCContentType.COURSE:
          _c = (
            <Course
              courseId={contentId}
              template={SCCourseTemplateType.PREVIEW}
              actions={<></>}
              hideEventParticipants
              hideEventPlanner
              variant="outlined"
              className={classes.object}
            />
          );
          break;
        case SCContentType.GROUP:
          _c = <Group groupId={contentId} variant="outlined" hideActions hideEventParticipants hideEventPlanner className={classes.object} />;
          break;
      }
    }
    return _c;
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {isContentObject && contentType !== SCContentType.COMMUNITY && clientSecret && (
        <Box className={classes.content}>
          <Box className={classes.contentObject}>
            <Box className={classes.contentCoverage} />
            {renderContentObject()}
          </Box>
          <Box className={classes.contentDesc}>
            <CheckoutHeaderInfoWidget content={content} contentType={contentType} />
          </Box>
        </Box>
      )}
      {clientSecret && (
        <Box id="checkout" className={classes.checkout}>
          <EmbeddedCheckoutProvider stripe={stripePromise} options={providerOptions}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Box>
      )}
      {!clientSecret && paymentOrder && (
        <Box className={classes.paymentOrder}>
          <Button variant="text" color="primary" href={`${appUrl}`} startIcon={<Icon>arrow_back</Icon>}>
            {' '}
            Back to home
          </Button>
          <Typography variant="h2" color="textSecondary" mb={2}>
            <b>
              <FormattedMessage id="ui.checkout.paymentOrder" defaultMessage="ui.checkout.paymentOrder" />
            </b>
          </Typography>
          <PaymentOrder paymentOrderId={paymentOrder.id} hidePaymentOrderPdfButton={contentType !== SCContentType.EVENT} />
        </Box>
      )}
    </Root>
  );
}
