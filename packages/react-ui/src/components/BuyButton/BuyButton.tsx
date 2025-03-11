import {LoadingButton} from '@mui/lab';
import {Icon, SwipeableDrawer, Typography, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCThemeType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {
  SCPaymentProduct,
  SCContentType,
  SCEventSubscriptionStatusType,
  SCGroupSubscriptionStatusType,
  SCPurchasableContent,
  SCGroupType,
  SCCategoryType,
  SCEventType,
  SCCourseType,
  SCCourseJoinStatusType,
  SCPaymentOrder,
  SCPaymentPrice
} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {MouseEvent, ReactNode, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import PaymentProductsDialog from '../PaymentProductsDialog';
import PaymentProducts from '../PaymentProducts';
import {CategoryApiClient, GroupApiClient, EventApiClient, CourseApiClient} from '@selfcommunity/api-services';
import {capitalize} from '@selfcommunity/utils';
import PaymentDetailDialog from '../PaymentDetailDialog';

const PREFIX = 'SCBuyButton';

const classes = {
  requestRoot: `${PREFIX}-request-root`,
  selectRoot: `${PREFIX}-select-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
  going: `${PREFIX}-going`,
  notGoing: `${PREFIX}-not-going`
};

const RequestRoot = styled(LoadingButton, {
  name: PREFIX,
  slot: 'RequestRoot'
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'DrawerRoot'
})(() => ({}));

export interface BuyButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Content type
   */
  contentType: SCContentType;

  /**
   * Content id
   */
  contentId?: number | string;

  /**
   * Purchasable Content
   */
  content?: SCPurchasableContent;

  /**
   * Prefetched products
   */
  prefetchedProducts?: SCPaymentProduct[];

  /**
   * onPurchase callback
   * @param user
   * @param joined
   */
  onPurchase?: (contentType: SCContentType, id: number) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Buy Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {BuyButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `BuyButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBuyButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function BuyButton(inProps: BuyButtonProps): JSX.Element {
  // PROPS
  const props: BuyButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, contentId, contentType, content, onPurchase, ...rest} = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONST
  const [purchased, setPurchased] = useState<boolean | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<SCPaymentOrder | null>(null);
  const [btnLabel, setBtnLabel] = useState<ReactNode>(
    <FormattedMessage defaultMessage={`ui.buyButton.buy${contentType}`} id={`ui.buyButton.buy${capitalize(contentType)}`} />
  );

  // HANDLERS
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const handleOpen = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!open) {
        if (!scUserContext.user) {
          scContext.settings.handleAnonymousAction();
        } else {
          setOpen(true);
        }
      }
    },
    [scUserContext.user, open, scContext.settings]
  );

  /**
   * Handle update order
   * Price param is the new price selected
   */
  const handleUpdatePaymentOrder = useCallback(
    (price: SCPaymentPrice) => {
      // TODO: update order/subscription when will be recurring payment
    },
    [paymentOrder, purchased]
  );

  /**
   * Get current status
   */
  const getStatus = () => {
    switch (contentType) {
      case SCContentType.EVENT:
        // Get status event subscribed
        EventApiClient.getSpecificEventInfo(contentId ? contentId : (content as SCEventType).id).then((data) => {
          if (scUserContext.user && data?.managed_by?.id !== scUserContext.user.id) {
            if (data.subscription_status === SCEventSubscriptionStatusType.GOING) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.purchased" id="ui.buyButton.purchased" />);
            }
            if (data.payment_order) {
              setPaymentOrder(data.payment_order);
            }
            setPurchased(data.subscription_status === SCEventSubscriptionStatusType.GOING);
          }
        });
        break;
      case SCContentType.CATEGORY:
        // Get status category followed
        CategoryApiClient.getSpecificCategory(contentId ? contentId : (content as SCCategoryType).id).then((data) => {
          if (data.followed) {
            setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.subscribed" id="ui.buyButton.subscribed" />);
          }
          if (data.payment_order) {
            setPaymentOrder(data.payment_order);
          }
          setPurchased(data.followed);
        });
        break;
      case SCContentType.GROUP:
        // Get status group subscribed
        GroupApiClient.getSpecificGroupInfo(contentId ? contentId : (content as SCGroupType).id).then((data) => {
          if (scUserContext.user && data?.managed_by?.id !== scUserContext.user.id) {
            if (data.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.subscribed" id="ui.buyButton.subscribed" />);
            }
            if (data.payment_order) {
              setPaymentOrder(data.payment_order);
            }
            setPurchased(data.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED);
          }
        });
        break;
      case SCContentType.COURSE:
        // Get status course joined
        CourseApiClient.getCourseStatus(contentId ? contentId : (content as SCCourseType).id).then((data) => {
          if (scUserContext.user && data?.managed_by?.id !== scUserContext.user.id) {
            if (data.subscription_status === SCCourseJoinStatusType.JOINED) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.subscribed" id="ui.buyButton.subscribed" />);
            }
            if (data.payment_order) {
              setPaymentOrder(data.payment_order);
            }
            setPurchased(data.subscription_status === SCCourseJoinStatusType.JOINED);
          }
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if ((contentId || content) && contentType && scUserContext.user) {
      getStatus();
    } else if (scUserContext.user === null) {
      setPurchased(false);
    }
  }, [contentId, content, contentType, scUserContext.user]);

  if (!contentId && !content) {
    return null;
  }

  return (
    <>
      <RequestRoot
        className={classNames(classes.requestRoot, className)}
        variant="contained"
        color={purchased ? 'inherit' : 'secondary'}
        size="small"
        startIcon={<Icon>card_giftcard</Icon>}
        loading={scUserContext.user === undefined || purchased === null}
        onClick={handleOpen}
        {...rest}>
        {btnLabel}
      </RequestRoot>
      {open && (
        <>
          {isMobile ? (
            <SwipeableDrawerRoot
              className={classes.drawerRoot}
              PaperProps={{className: classes.paper}}
              open
              onClose={handleClose}
              onOpen={handleOpen}
              anchor="bottom"
              disableSwipeToOpen>
              <>
                <Typography variant="h5" component="div" marginBottom={2}>
                  <b>
                    {paymentOrder ? (
                      <FormattedMessage id="ui.paymentProductsDialog.title.purchased" defaultMessage="ui.paymentProductsDialog.title.purchased" />
                    ) : (
                      <FormattedMessage id="ui.paymentProductsDialog.title" defaultMessage="ui.paymentProductsDialog.title" />
                    )}
                  </b>
                </Typography>
                <PaymentProducts
                  contentType={contentType}
                  {...(content ? {content} : {contentId})}
                  {...(paymentOrder && {paymentOrder: paymentOrder, onUpdatePaymentOrder: handleUpdatePaymentOrder})}
                />
              </>
            </SwipeableDrawerRoot>
          ) : (
            <>
              <PaymentProductsDialog
                open
                onClose={handleClose}
                PaymentProductsComponentProps={{
                  contentType,
                  ...(content ? {content} : {contentId}),
                  ...(paymentOrder && {paymentOrder: paymentOrder, onUpdatePaymentOrder: handleUpdatePaymentOrder})
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
