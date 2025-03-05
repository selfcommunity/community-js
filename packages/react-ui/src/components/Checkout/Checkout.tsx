import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from '@stripe/react-stripe-js';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {PaymentApiClient} from '@selfcommunity/api-services';
import CheckoutSkeleton from './Skeleton';
import {PREFIX} from './constants';
import {SCContentType, SCPurchasableContent} from '@selfcommunity/types';
import {IntlShape, useIntl} from 'react-intl';
import {getDefaultLocale} from '../../utils/payment';
import {SCPreferences, SCPreferencesContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import Event from '../Event';
import Category from '../Category';
import Course from '../Course';
import Group from '../Group';
import {SCEventTemplateType} from '../../types/event';
import {SCCourseTemplateType} from '../../types/course';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  contentObject: `${PREFIX}-content-object`,
  contentDesc: `${PREFIX}-content-desc`,
  checkout: `${PREFIX}-checkout`,
  object: `${PREFIX}-object`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  [`& .${classes.content}`]: {
    width: '100%',
    maxWidth: 860,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0,
    [theme.breakpoints.down(1034)]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    [`& .${classes.contentObject}`]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    [`& .${classes.contentDesc}`]: {
      [theme.breakpoints.down(1034)]: {
        display: 'none'
      },
      maxWidth: 600,
      padding: theme.spacing(4)
    }
  },
  [`& .${classes.checkout}`]: {
    width: '100%',
    bottom: theme.spacing(2)
  },
  [`& .${classes.object}`]: {
    marginTop: theme.spacing(2),
    minWidth: 395
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

  // CONTEXT
  const scUserContext = useSCUser();
  const intl: IntlShape = useIntl();

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
  const stripePromise: Promise<Stripe> | null =
    stripePublicKey && stripeConnectedAccountId && loadStripe
      ? loadStripe(stripePublicKey, {stripeAccount: stripeConnectedAccountId, locale: getDefaultLocale(intl).locale})
      : null;

  // STATE
  const [clientSecret, setClientSecret] = useState<string | null>(props.clientSecret);

  const isContentObject = useMemo(() => contentType && contentId !== undefined, [contentType, contentId]);

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
          return (
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
          _c = <Group courseId={contentId} actions={<></>} hideEventParticipants hideEventPlanner variant="outlined" className={classes.object} />;
          break;
      }
    }
    return _c;
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {isContentObject && (
        <Box className={classes.content}>
          <Box className={classes.contentObject}>{renderContentObject()}</Box>
          <Box className={classes.contentDesc}>
            <Typography variant="body2" color="textSecondary">
              A Gold Ticket for event access is a premium pass that offers exclusive benefits beyond standard entry. It typically includes priority
              admission, access to VIP areas, reserved seating, and additional perks such as meet-and-greet opportunities, complimentary refreshments,
              or exclusive merchandise.
            </Typography>
          </Box>
        </Box>
      )}
      <Box id="checkout" className={classes.checkout}>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret}}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </Box>
    </Root>
  );
}
