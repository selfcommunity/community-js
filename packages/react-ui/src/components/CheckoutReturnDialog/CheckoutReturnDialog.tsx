import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, CircularProgress, Dialog, DialogContent, DialogProps, DialogTitle, Slide, Stack, styled, Typography} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import {FormattedMessage, useIntl} from 'react-intl';
import {SCCategoryType, SCCheckoutSessionStatus, SCContentType, SCCourseType, SCEventType, SCGroupType, SCPaymentPrice} from '@selfcommunity/types';
import SuccessPlaceholder from '../../assets/checkout/success';
import {
  Link,
  SCContextType,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCContext,
  useSCPaymentsEnabled,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {PaymentApiClient} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Grow from '@mui/material/Grow';
import {getPaymentRecurringLabel} from '../../utils/checkout';

const PREFIX = 'SCCheckoutReturnDialog';

const classes = {
  root: `${PREFIX}-root`,
  img: `${PREFIX}-img`,
  object: `${PREFIX}-object`,
  btn: `${PREFIX}-btn`
};

const Root = styled(Dialog, {
  slot: 'Root',
  name: PREFIX
})(() => ({}));

const Transition = React.forwardRef(function Transition(props: TransitionProps & {children: React.ReactElement}, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoTransition = function NoTransition(props: {children: React.ReactElement}) {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export interface CheckoutReturnDialogProps extends DialogProps {
  className?: string;
  checkoutSessionId: string;
  disableInitialTransition?: boolean;
  onHandleViewContentPurchased?: (redirectUrl: string, contentType: SCContentType) => void;
  returnUrl?: string;
}

export default function CheckoutReturnDialog(inProps: CheckoutReturnDialogProps) {
  // PROPS
  const props: CheckoutReturnDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, checkoutSessionId, disableInitialTransition = false, onHandleViewContentPurchased, returnUrl, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [contentType, setContentType] = useState<SCContentType | null>(null);
  const [, setContentId] = useState<number | null>(null);
  const [content, setContent] = useState<SCEventType | SCGroupType | SCCourseType | SCCategoryType | null>(null);
  const [paymentPrice, setPaymentPrice] = useState<SCPaymentPrice | null>(null);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const intl = useIntl();

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const appUrl = useMemo(
    () => scPreferencesContext.preferences && scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_APP_URL].value,
    [scPreferencesContext.preferences]
  );

  /**
   * Handle view new object purchased
   */
  const handleViewPurchasedObject = useCallback(() => {
    let _redirectUrl: string;
    switch (contentType) {
      case SCContentType.GROUP:
        _redirectUrl = scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, content);
        break;
      case SCContentType.EVENT:
        _redirectUrl = scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, content);
        break;
      case SCContentType.CATEGORY:
        _redirectUrl = scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, content);
        break;
      case SCContentType.COURSE:
        _redirectUrl = scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, content);
        break;
      case SCContentType.COMMUNITY:
        _redirectUrl = appUrl;
        break;
      default:
        break;
    }
    if (onHandleViewContentPurchased) {
      onHandleViewContentPurchased(returnUrl ? returnUrl : _redirectUrl, contentType);
    } else if (_redirectUrl) {
      window.location.href = returnUrl ? returnUrl : _redirectUrl;
    }
  }, [scRoutingContext, onHandleViewContentPurchased, content, contentType]);

  /**
   * Handle refresh content status
   */
  const refreshContentStatus = useCallback(() => {
    switch (contentType) {
      case SCContentType.GROUP:
        scUserContext.managers.groups.refresh();
        break;
      case SCContentType.EVENT:
        scUserContext.managers.events.refresh();
        break;
      case SCContentType.CATEGORY:
        scUserContext.managers.categories.refresh();
        break;
      case SCContentType.COURSE:
        scUserContext.managers.courses.refresh();
        break;
      default:
        break;
    }
  }, [scUserContext, content, contentType]);

  useEffect(() => {
    PaymentApiClient.getCheckoutSession({session_id: checkoutSessionId})
      .then((r) => {
        if (r.status === SCCheckoutSessionStatus.COMPLETE) {
          PaymentApiClient.checkoutCompleteSession({session_id: checkoutSessionId}).then((r) => {
            setContentType(r.content_type);
            setContentId(r.content_id);
            setContent(r[r.content_type]);
            if (r.payment_price) {
              setPaymentPrice(r.payment_price);
            }
            // Refresh subscription status
            refreshContentStatus();
            setLoading(false);
          });
        } else if (r.status === SCCheckoutSessionStatus.OPEN) {
          Logger.info(SCOPE_SC_UI, 'Status session: open. Payment is in status pending!');
        }
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  }, []);

  const renderTitle = () => {
    return <>{!loading && <FormattedMessage id="ui.checkoutReturnDialog.title" defaultMessage="ui.checkoutReturnDialog.title" />}</>;
  };

  const renderContent = () => {
    let footer;
    if (contentType === SCContentType.EVENT) {
      footer = (
        <>
          <Typography color="primary">
            <FormattedMessage id="ui.checkoutReturnDialog.payment.success" defaultMessage="ui.checkoutReturnDialog.payment.success" />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {paymentPrice && paymentPrice.recurring_interval ? (
              <FormattedMessage
                id="ui.checkoutReturnDialog.buy.recurrent.event"
                defaultMessage="ui.checkoutReturnDialog.buy.recurrent.event"
                values={{
                  frequency: getPaymentRecurringLabel(paymentPrice.recurring_interval, scContext.settings.locale.default)
                }}
              />
            ) : (
              <FormattedMessage id="ui.checkoutReturnDialog.buy.event" defaultMessage="ui.checkoutReturnDialog.buy.event" />
            )}
          </Typography>
          <Button size="medium" variant={'contained'} onClick={handleViewPurchasedObject} component={Link} className={classes.btn}>
            <FormattedMessage id="ui.checkoutReturnDialog.event.button" defaultMessage="ui.checkoutReturnDialog.event.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.CATEGORY) {
      footer = (
        <>
          <Typography color="primary">
            <FormattedMessage id="ui.checkoutReturnDialog.payment.success" defaultMessage="ui.checkoutReturnDialog.payment.success" />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <FormattedMessage id="ui.checkoutReturnDialog.buy" defaultMessage="ui.checkoutReturnDialog.buy" />
          </Typography>
          <Button size="medium" variant={'contained'} onClick={handleViewPurchasedObject} component={Link} className={classes.btn}>
            <FormattedMessage id="ui.checkoutReturnDialog.category.button" defaultMessage="ui.checkoutReturnDialog.category.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.COURSE) {
      footer = (
        <>
          <Typography color="primary">
            <FormattedMessage id="ui.checkoutReturnDialog.payment.success" defaultMessage="ui.checkoutReturnDialog.payment.success" />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {paymentPrice && paymentPrice.recurring_interval ? (
              <FormattedMessage
                id="ui.checkoutReturnDialog.buy.recurrent.course"
                defaultMessage="ui.checkoutReturnDialog.buy.recurrent.course"
                values={{
                  frequency: getPaymentRecurringLabel(paymentPrice.recurring_interval, scContext.settings.locale.default)
                }}
              />
            ) : (
              <FormattedMessage id="ui.checkoutReturnDialog.buy.course" defaultMessage="ui.checkoutReturnDialog.buy.course" />
            )}
          </Typography>
          <Button size="medium" variant={'contained'} onClick={handleViewPurchasedObject} component={Link} className={classes.btn}>
            <FormattedMessage id="ui.checkoutReturnDialog.course.button" defaultMessage="ui.checkoutReturnDialog.course.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.GROUP) {
      footer = (
        <>
          <Typography color="primary">
            <FormattedMessage id="ui.checkoutReturnDialog.payment.success" defaultMessage="ui.checkoutReturnDialog.payment.success" />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {paymentPrice && paymentPrice.recurring_interval ? (
              <FormattedMessage
                id="ui.checkoutReturnDialog.buy.recurrent.group"
                defaultMessage="ui.checkoutReturnDialog.buy.recurrent.group"
                values={{
                  frequency: getPaymentRecurringLabel(paymentPrice.recurring_interval, scContext.settings.locale.default)
                }}
              />
            ) : (
              <FormattedMessage id="ui.checkoutReturnDialog.buy.group" defaultMessage="ui.checkoutReturnDialog.buy.group" />
            )}
          </Typography>
          <Button size="medium" variant={'contained'} onClick={handleViewPurchasedObject} component={Link} className={classes.btn}>
            <FormattedMessage id="ui.checkoutReturnDialog.group.button" defaultMessage="ui.checkoutReturnDialog.group.button" />
          </Button>
        </>
      );
    } else if (contentType === SCContentType.COMMUNITY) {
      footer = (
        <>
          {paymentPrice && (
            <>
              <Typography color="primary">
                <FormattedMessage id="ui.checkoutReturnDialog.payment.success" defaultMessage="ui.checkoutReturnDialog.payment.success" />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {paymentPrice.recurring_interval ? (
                  <FormattedMessage
                    id="ui.checkoutReturnDialog.buy.recurrent.community"
                    defaultMessage="ui.checkoutReturnDialog.buy.recurrent.community"
                    values={{
                      frequency: getPaymentRecurringLabel(paymentPrice.recurring_interval, scContext.settings.locale.default)
                    }}
                  />
                ) : (
                  <FormattedMessage id="ui.checkoutReturnDialog.buy.community" defaultMessage="ui.checkoutReturnDialog.buy.community" />
                )}
              </Typography>
            </>
          )}
          <Button size="medium" variant={'contained'} onClick={handleViewPurchasedObject} component={Link} className={classes.btn}>
            <FormattedMessage id="ui.checkoutReturnDialog.community.button" defaultMessage="ui.checkoutReturnDialog.community.button" />
          </Button>
        </>
      );
    }
    return (
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Grow in style={{transitionDelay: '300ms'}}>
          <img
            src={SuccessPlaceholder}
            className={classes.img}
            alt={intl.formatMessage({
              id: 'ui.checkoutReturnDialog.buy',
              defaultMessage: 'ui.checkoutReturnDialog.buy'
            })}
            width={100}
            height={100}
          />
        </Grow>
        {footer}
      </Stack>
    );
  };

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root
      maxWidth="sm"
      fullWidth
      scroll="paper"
      open
      {...(disableInitialTransition ? {slots: {transition: NoTransition}} : {slots: {transition: Transition}})}
      className={classNames(classes.root, className)}
      {...rest}>
      <DialogTitle>{renderTitle()}</DialogTitle>
      <DialogContent>{loading ? <CircularProgress /> : renderContent()}</DialogContent>
    </Root>
  );
}
