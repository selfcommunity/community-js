import {LoadingButton} from '@mui/lab';
import {Icon, styled, SwipeableDrawer, Tooltip, Typography, useMediaQuery, useTheme} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCThemeType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {
  SCCategoryType,
  SCContentType,
  SCCourseJoinStatusType,
  SCCourseType,
  SCEventSubscriptionStatusType,
  SCEventType,
  SCGroupSubscriptionStatusType,
  SCGroupType,
  SCPaymentOrder,
  SCPaymentPrice,
  SCPaymentProduct,
  SCPurchasableContent
} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {ReactNode, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import PaywallsDialog from '../PaywallsDialog';
import {CategoryApiClient, CourseApiClient, EventApiClient, GroupApiClient} from '@selfcommunity/api-services';
import {capitalize} from '@selfcommunity/utils';
import Paywalls from '../Paywalls';
import PaymentOrderPdfButton, {PaymentOrderPdfButtonProps} from '../PaymentOrderPdfButton';

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
   * show ticket button if content is already paid
   */
  showTicket?: boolean;

  /**
   * Props to spread to the PaymentOrderPdfButton component
   * @default {}
   */
  PaymentOrderPdfButtonComponentProps?: PaymentOrderPdfButtonProps;

  /**
   * Overrides the button label.
   * @default null
   */
  label?: React.ReactNode;

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

  const {
    className,
    contentId,
    contentType,
    content,
    disabled,
    onPurchase,
    showTicket = false,
    PaymentOrderPdfButtonComponentProps = {},
    label,
    ...rest
  } = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONST
  const [purchased, setPurchased] = useState<boolean | null>(null);
  const [products, setProducts] = useState<SCPaymentProduct[] | []>([]);
  const [paymentOrder, setPaymentOrder] = useState<SCPaymentOrder | null>(null);
  const [btnLabel, setBtnLabel] = useState<ReactNode>(
    label ?? <FormattedMessage defaultMessage={`ui.buyButton.buy${contentType}`} id={`ui.buyButton.buy${capitalize(contentType)}`} />
  );

  // HANDLERS
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const handleOpen = useCallback(() => {
    if (!open) {
      if (!scUserContext.user) {
        scContext.settings.handleAnonymousAction();
      } else {
        setOpen(true);
      }
    }
  }, [scUserContext.user, open, scContext.settings]);

  /**
   * Handle update order
   * Price param is the new price selected
   */
  const handleUpdatePaymentOrder = useCallback(
    (_price: SCPaymentPrice) => {
      // update order/subscription when will be recurring payment
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
            if (data.paywalls) {
              setProducts(data.paywalls);
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
          if (data.followed || data.payment_order) {
            setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.purchased" id="ui.buyButton.purchased" />);
          }
          if (data.paywalls) {
            setProducts(data.paywalls);
          }
          if (data.payment_order) {
            setPaymentOrder(data.payment_order);
          }
          setPurchased(Boolean(data.followed || data.payment_order));
        });
        break;
      case SCContentType.GROUP:
        // Get status group subscribed
        GroupApiClient.getSpecificGroupInfo(contentId ? contentId : (content as SCGroupType).id).then((data) => {
          if (scUserContext.user && data?.managed_by?.id !== scUserContext.user.id) {
            if (data.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.subscribed" id="ui.buyButton.subscribed" />);
            }
            if (data.paywalls) {
              setProducts(data.paywalls);
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
        CourseApiClient.getSpecificCourseInfo(contentId ? contentId : (content as SCCourseType).id).then((data) => {
          if (scUserContext.user && data?.created_by?.id !== scUserContext.user.id) {
            if (data.join_status === SCCourseJoinStatusType.JOINED) {
              setBtnLabel(<FormattedMessage defaultMessage="ui.buyButton.purchased" id="ui.buyButton.purchased" />);
            }
            if (data.paywalls) {
              setProducts(data.paywalls);
            }
            if (data.payment_order) {
              setPaymentOrder(data.payment_order);
            }
            setPurchased(data.join_status === SCCourseJoinStatusType.JOINED || data.join_status === SCCourseJoinStatusType.MANAGER);
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
      <Tooltip title={disabled ? <FormattedMessage id="ui.buyButton.disabled" defaultMessage="ui.buyButton.disabled" /> : ''}>
        <RequestRoot
          className={classNames(classes.requestRoot, className)}
          variant="contained"
          color={purchased ? 'inherit' : 'secondary'}
          size="small"
          startIcon={<Icon>dredit-card</Icon>}
          loading={scUserContext.user === undefined || purchased === null}
          onClick={handleOpen}
          disabled={disabled || (!paymentOrder && purchased)}
          {...rest}>
          {!paymentOrder && purchased ? <FormattedMessage id="ui.buyButton.free" defaultMessage="ui.buyButton.free" /> : btnLabel}
        </RequestRoot>
      </Tooltip>
      {paymentOrder && showTicket && <PaymentOrderPdfButton {...PaymentOrderPdfButtonComponentProps} paymentOrder={paymentOrder} />}
      {open && (
        <>
          {isMobile ? (
            <SwipeableDrawerRoot
              className={classes.drawerRoot}
              slotProps={{
                paper: {
                  className: classes.paper
                }
              }}
              open
              onClose={handleClose}
              onOpen={handleOpen}
              anchor="bottom"
              disableSwipeToOpen>
              <>
                <Typography variant="h5" component="div" marginBottom={2}>
                  <b>
                    {paymentOrder ? (
                      <FormattedMessage id="ui.paywallsDialog.title.purchased" defaultMessage="ui.paywallsDialog.title.purchased" />
                    ) : (
                      <FormattedMessage id="ui.paywallsDialog.title" defaultMessage="ui.paywallsDialog.title" />
                    )}
                  </b>
                </Typography>
                <Paywalls
                  contentType={contentType}
                  {...(content ? {content} : {contentId})}
                  prefetchedPaymentContentStatus={{
                    paywalls: products,
                    payment_order: paymentOrder
                  }}
                  onUpdatePaymentOrder={handleUpdatePaymentOrder}
                />
              </>
            </SwipeableDrawerRoot>
          ) : (
            <>
              <PaywallsDialog
                open
                onClose={handleClose}
                PaywallsComponentProps={{
                  contentType,
                  ...(content ? {content} : {contentId}),
                  prefetchedPaymentContentStatus: {
                    paywalls: products,
                    payment_order: paymentOrder
                  },
                  onUpdatePaymentOrder: handleUpdatePaymentOrder
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
