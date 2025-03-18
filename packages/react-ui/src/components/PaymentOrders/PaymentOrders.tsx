import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  Skeleton,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  CircularProgress
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {FormattedMessage, useIntl} from 'react-intl';
import LoadingButton from '@mui/lab/LoadingButton';
import {useInView} from 'react-intersection-observer';
import {PaymentService} from '@selfcommunity/api-services';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {getConvertedAmount} from '../../utils/payment';
import Event from '../Event';
import {SCCategoryType, SCCommunityType, SCContentType, SCCourseType, SCEventType, SCGroupType, SCPaymentOrder} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import {SCCourseTemplateType, SCEventTemplateType} from '@selfcommunity/react-ui';
import Category from '../Category';
import Course from '../Course';
import Group from '../Group';
import PaymentProduct from '../PaymentProduct';

const PREFIX = 'SCPaymentOrders';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  headline: `${PREFIX}-headline`,
  btnSave: `${PREFIX}-btn-save`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({
  [`& .${classes.content}`]: {
    position: 'relative',
    padding: '30px 10px',
    '& table': {
      '& tr': {
        '& th': {
          zIndex: 1
        }
      }
    }
  },
  [`& .${classes.headline}`]: {
    margin: '40px 0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  [`& .${classes.btnSave}`]: {
    margin: '30px 0'
  }
}));

export interface PaymentOrdersProps {
  className?: string;
}

export default function PaymentOrders(inProps: PaymentOrdersProps) {
  // PROPS
  const props: PaymentOrdersProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, ...rest} = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setInvoices] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [next, setNext] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const {ref, inView} = useInView({triggerOnce: false});
  const intl = useIntl();

  /**
   * Infinite load more orders
   */
  const loadMore = useCallback(async () => {
    const loadItems = async () => {
      try {
        const res = await PaymentService.getPaymentsOrder({offset: orders.length, order_by: '-created_at'});
        if (res) {
          setHasMore(res.next !== null);
          setNext(res.next);
          setInvoices(orders.concat(res.results));
          setIsLoadingPage(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (hasMore && !isLoadingPage) {
      setIsLoadingPage(true);
      await loadItems();
    }
  }, [orders, isLoadingPage, isLoading, hasMore, next]);

  const renderContent = (order: SCPaymentOrder) => {
    const contentType: SCContentType = order.content_type;
    const content: SCEventType | SCCategoryType | SCCourseType | SCGroupType | SCCommunityType = order[order.content_type];
    if (contentType === SCContentType.EVENT) {
      return (
        <Event
          event={content as SCEventType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          template={SCEventTemplateType.SNIPPET}
          actions={<></>}
          variant="outlined"
        />
      );
    } else if (contentType === SCContentType.CATEGORY) {
      return <Category category={content as SCCategoryType} cacheStrategy={CacheStrategies.NETWORK_ONLY} actions={<></>} variant="outlined" />;
    } else if (contentType === SCContentType.COURSE) {
      return (
        <Course
          course={content as SCCourseType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          template={SCCourseTemplateType.SNIPPET}
          actions={<></>}
          hideEventParticipants
          hideEventPlanner
          variant="outlined"
        />
      );
    } else if (contentType === SCContentType.GROUP) {
      return (
        <Group
          group={content as SCGroupType}
          cacheStrategy={CacheStrategies.NETWORK_ONLY}
          hideActions
          variant="outlined"
          hideEventParticipants
          hideEventPlanner
        />
      );
    } else if (contentType === SCContentType.COMMUNITY) {
      if (order?.payment_price?.payment_product) {
        return <PaymentProduct hidePaymentProductPrices paymentProduct={order.payment_price.payment_product} />;
      }
      return null;
    }
  };

  /**
   * Load more orders
   */
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  /**
   * Initial load
   */
  useEffect(() => {
    loadMore();
  }, []);

  if (!isPaymentsEnabled) {
    return null;
  }

  /**
   * Render skeleton
   */
  const skeleton = () => {
    return (
      <TableRow ref={ref}>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={20} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={30} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={80} width={250} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={65} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={65} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={65} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={65} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={65} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.content}>
        {!isLoading ? (
          <TableContainer style={{margin: 'auto', borderRadius: 0}} component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width="5%">
                    <FormattedMessage id="ui.paymentOrders.number" defaultMessage="ui.paymentOrders.number" />
                  </TableCell>
                  <TableCell width="7%">
                    <FormattedMessage id="ui.paymentOrders.contentType" defaultMessage="ui.paymentOrders.contentType" />
                  </TableCell>
                  <TableCell width="38%">
                    <FormattedMessage id="ui.paymentOrders.content" defaultMessage="ui.paymentOrders.content" />
                  </TableCell>
                  <TableCell width="10%">
                    <FormattedMessage id="ui.paymentOrders.price" defaultMessage="ui.paymentOrders.price" />
                  </TableCell>
                  <TableCell width="12%">
                    <FormattedMessage id="ui.paymentOrders.createdAt" defaultMessage="ui.paymentOrders.createdAt" />
                  </TableCell>
                  <TableCell width="13%">
                    <FormattedMessage id="ui.paymentOrders.expired_at" defaultMessage="ui.paymentOrders.expired_at" />
                  </TableCell>
                  <TableCell width="10%">
                    <FormattedMessage id="ui.paymentOrders.status" defaultMessage="ui.paymentOrders.status" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="ui.paymentOrders.actions" defaultMessage="ui.paymentOrders.actions" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell scope="row">
                      <b>{order.id}</b>
                    </TableCell>
                    <TableCell scope="row">{order.content_type}</TableCell>
                    <TableCell scope="row">{renderContent(order)}</TableCell>
                    <TableCell scope="row">{getConvertedAmount(order.payment_price)}</TableCell>
                    <TableCell scope="row">
                      {order.created_at &&
                        intl.formatDate(new Date(order.created_at), {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                    </TableCell>
                    <TableCell scope="row">
                      {order.expired_at
                        ? intl.formatDate(new Date(order.expired_at), {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                          })
                        : '-'}
                    </TableCell>
                    <TableCell scope="row">
                      <Chip variant={'outlined'} label="Pagata" color="success" size="small" />
                    </TableCell>
                    <TableCell scope="row">
                      <Stack direction="row" justifyContent="left" alignItems="center" spacing={2}>
                        {/* <InvoicePdfViewButton
                                size="small"
                                variant="contained"
                                InvoicePdfViewDialogProps={{
                                  InvoicePdfViewProps: {order, hideDownloadLink: true, maxWidth: 1280}
                                }}
                              />*/}
                        {Boolean(!order.paid && order.billing_reason === 'subscription_create') && (
                          <LoadingButton size="small" variant="contained" disabled={true}>
                            <FormattedMessage id="ui.paymentOrders.pay" defaultMessage="ui.paymentOrders.pay" />
                          </LoadingButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length < 1 && (
                  <TableRow>
                    <TableCell align="left" colSpan={6}>
                      <Typography variant="body2">
                        <TableCell>
                          <FormattedMessage id="ui.paymentOrders.noOrders" defaultMessage="ui.paymentOrders.noOrders" />
                        </TableCell>
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {hasMore && <>{skeleton()}</>}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Root>
  );
}
