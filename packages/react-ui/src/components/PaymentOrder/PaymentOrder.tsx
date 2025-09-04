import React from 'react';
import {Box, Chip, Stack, Typography, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {useSCFetchPaymentOrder, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {SCCategoryType, SCContentType, SCCourseType, SCEventType, SCGroupType, SCPaymentOrder} from '@selfcommunity/types';
import {PREFIX} from './constants';
import {FormattedMessage, useIntl} from 'react-intl';
import Event from '../Event';
import {CacheStrategies} from '@selfcommunity/utils';
import Category from '../Category';
import Course from '../Course';
import Group from '../Group';
import PaymentProduct from '../PaymentProduct';
import PaymentOrderSkeleton from './Skeleton';
import PaymentOrderPdfButton, {PaymentOrderPdfButtonProps} from '../PaymentOrderPdfButton';
import {getConvertedAmount} from '../../utils/payment';
import {SCCourseTemplateType} from '../../types/course';
import {SCEventTemplateType} from '../../types/event';

const classes = {
  root: `${PREFIX}-root`,
  img: `${PREFIX}-img`,
  contentObject: `${PREFIX}-content-object`,
  object: `${PREFIX}-object`,
  status: `${PREFIX}-status`,
  details: `${PREFIX}-details`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface PaymentOrderProps {
  className?: string;
  paymentOrderId?: number;
  paymentOrder?: SCPaymentOrder;
  hidePaymentOrderPdfButton?: boolean;
  PaymentOrderPdfButtonComponentProps?: PaymentOrderPdfButtonProps;
}

export default function PaymentOrder(inProps: PaymentOrderProps) {
  // PROPS
  const props: PaymentOrderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, paymentOrderId, paymentOrder, hidePaymentOrderPdfButton = false, PaymentOrderPdfButtonComponentProps = {}, ...rest} = props;

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const {scPaymentOrder} = useSCFetchPaymentOrder({id: paymentOrderId, paymentOrder});
  const intl = useIntl();

  if (!isPaymentsEnabled || !scPaymentOrder) {
    return <PaymentOrderSkeleton />;
  }

  const renderContent = () => {
    let header;
    const content = scPaymentOrder[scPaymentOrder.content_type];
    if (scPaymentOrder.content_type === SCContentType.EVENT) {
      header = (
        <Event
          event={content as SCEventType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          template={SCEventTemplateType.PREVIEW}
          actions={<></>}
          variant="outlined"
          className={classes.object}
        />
      );
    } else if (scPaymentOrder.content_type === SCContentType.CATEGORY) {
      header = (
        <Category
          category={content as SCCategoryType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          actions={<></>}
          variant="outlined"
          className={classes.object}
        />
      );
    } else if (scPaymentOrder.content_type === SCContentType.COURSE) {
      header = (
        <Course
          course={content as SCCourseType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          template={SCCourseTemplateType.PREVIEW}
          actions={<></>}
          hideEventParticipants
          hideEventPlanner
          variant="outlined"
          className={classes.object}
        />
      );
    } else if (scPaymentOrder.content_type === SCContentType.GROUP) {
      header = (
        <Group
          group={content as SCGroupType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          hideActions
          variant="outlined"
          hideEventParticipants
          hideEventPlanner
          className={classes.object}
        />
      );
    } else if (scPaymentOrder.content_type === SCContentType.COMMUNITY) {
      header = (
        <>
          {scPaymentOrder.payment_price?.payment_product && (
            <PaymentProduct hidePaymentProductPrices paymentProduct={scPaymentOrder.payment_price?.payment_product} />
          )}
        </>
      );
    }
    return (
      <Stack spacing={2} justifyContent="center" alignItems="flex-start">
        <Box className={classes.contentObject}>{header}</Box>
      </Stack>
    );
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {renderContent()}
      <Box className={classes.details}>
        <Typography variant="body2" color="textSecondary">
          <FormattedMessage
            id="ui.paymentOrder.date"
            defaultMessage="ui.paymentOrder.date"
            values={{
              date: intl.formatDate(new Date(scPaymentOrder.created_at), {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })
            }}
          />
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <FormattedMessage
            id="ui.paymentOrder.price"
            defaultMessage="ui.paymentOrder.price"
            values={{price: getConvertedAmount(scPaymentOrder.payment_price)}}
          />
        </Typography>
        <Typography variant="body2" color="textSecondary" component="span">
          <FormattedMessage id="ui.paymentOrder.status" defaultMessage="ui.paymentOrder.status" />
        </Typography>
        <Chip
          className={classes.status}
          variant={'outlined'}
          label={<FormattedMessage id="ui.paymentOrder.status.paid" defaultMessage="ui.paymentOrder.status.paid" />}
          color="success"
          size="small"
        />
        <br />
        {scPaymentOrder && !hidePaymentOrderPdfButton && (
          <PaymentOrderPdfButton
            paymentOrder={scPaymentOrder}
            label={<FormattedMessage id="ui.paymentOrder.ticket.view" defaultMessage="ui.paymentOrder.ticket.view" />}
            {...PaymentOrderPdfButtonComponentProps}
          />
        )}
      </Box>
    </Root>
  );
}
