import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {CommunityApiClient, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCCommunityType, SCContentType, SCPaymentOrder, SCPaymentPrice, SCPaymentProduct} from '@selfcommunity/types';
import {useIsComponentMountedRef, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import CommunityPaywallSkeleton from './Skeleton';
import PaymentProduct from '../PaymentProduct';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Grid, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface CommunityPaywallsProps {
  className?: string;
  community?: SCCommunityType;
  onUpdatePaymentOrder?: (price: SCPaymentPrice, contentType?: SCContentType, contentId?: string | number) => void;
  callbackUrl?: string;
}

export default function CommunityPaywalls(inProps: CommunityPaywallsProps) {
  // PROPS
  const props: CommunityPaywallsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, community, onUpdatePaymentOrder, callbackUrl, ...rest} = props;

  // STATE
  const [scCommunity, setSCCommunity] = useState<SCCommunityType>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const isMountedRef = useIsComponentMountedRef();

  /**
   * On mount, fetches community products
   */
  useEffect(() => {
    if (community) {
      setSCCommunity(community);
      setLoading(false);
    } else {
      CommunityApiClient.getCommunities()
        .then((data: SCPaginatedResponse<SCCommunityType>) => {
          if (isMountedRef.current) {
            if (data.count && data.results.length) {
              setSCCommunity(data.results[0]);
            }
            setLoading(false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [community]);

  if (!isPaymentsEnabled) {
    return null;
  }

  if (loading) {
    return <CommunityPaywallSkeleton />;
  }

  return (
    <Root className={classNames(classes.root, className)} container spacing={4} {...rest}>
      {scCommunity.paywalls.map((p, i) => (
        <Grid xs={12} sm={6} md={4} key={i}>
          <PaymentProduct
            expanded
            paymentProduct={p}
            contentType={SCContentType.COMMUNITY}
            contentId={scCommunity.id}
            {...(scCommunity.payment_order && {paymentOrder: scCommunity.payment_order, onUpdatePaymentOrder})}
            {...(scCommunity.payment_order && {paymentOrder: scCommunity.payment_order, onUpdatePaymentOrder})}
            {...(callbackUrl && {PaymentProductPriceComponentProps: {returnUrlParams: {callbackUrl}}})}
          />
        </Grid>
      ))}
    </Root>
  );
}
