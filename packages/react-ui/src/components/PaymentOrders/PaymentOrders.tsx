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
  CircularProgress,
  styled,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Icon,
  Button,
  useTheme,
  useMediaQuery,
  MenuItem
} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import LoadingButton from '@mui/lab/LoadingButton';
import {useInView} from 'react-intersection-observer';
import {PaymentService} from '@selfcommunity/api-services';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {SCContextType, SCThemeType, useSCContext, useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {getConvertedAmount} from '../../utils/payment';
import Event from '../Event';
import {SCCategoryType, SCCommunityType, SCContentType, SCCourseType, SCEventType, SCGroupType, SCPaymentOrder} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCCourseTemplateType, SCEventTemplateType} from '../../types';
import Course from '../Course';
import Group from '../Group';
import PaymentProduct from '../PaymentProduct';
import PaymentOrderPdfButton from '../PaymentOrderPdfButton';
import {SCOPE_SC_UI} from '../../constants/Errors';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {LocalizationProvider, MobileDatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import Category from '../Category';

const PREFIX = 'SCPaymentOrders';

const messages = defineMessages({
  dateFrom: {
    id: 'ui.paymentOrders.dateFrom',
    defaultMessage: 'ui.paymentOrders.dateFrom'
  },
  dateTo: {
    id: 'ui.paymentOrders.dateTo',
    defaultMessage: 'ui.paymentOrders.dateTo'
  },
  pickerCancelAction: {
    id: 'ui.paymentOrders.picker.cancel',
    defaultMessage: 'ui.paymentOrders.picker.cancel'
  },
  pickerClearAction: {
    id: 'ui.paymentOrders.picker.clear',
    defaultMessage: 'ui.paymentOrders.picker.clear'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  filters: `${PREFIX}-filters`,
  search: `${PREFIX}-search`,
  picker: `${PREFIX}-picker`
};

const options = [
  {
    value: SCContentType.ALL,
    label: <FormattedMessage id="ui.paymentOrders.contentType.all" defaultMessage="ui.paymentOrders.contentType.all" />
  },
  {
    value: SCContentType.COMMUNITY,
    label: <FormattedMessage id="ui.paymentOrders.contentType.community" defaultMessage="ui.paymentOrders.contentType.community" />
  },
  {
    value: SCContentType.COURSE,
    label: <FormattedMessage id="ui.paymentOrders.contentType.course" defaultMessage="ui.paymentOrders.contentType.course" />
  },
  {
    value: SCContentType.EVENT,
    label: <FormattedMessage id="ui.paymentOrders.contentType.event" defaultMessage="ui.paymentOrders.contentType.event" />
  },
  {
    value: SCContentType.GROUP,
    label: <FormattedMessage id="ui.paymentOrders.contentType.group" defaultMessage="ui.paymentOrders.contentType.group" />
  }
];

const Root = styled(Paper, {
  slot: 'Root',
  name: PREFIX
})(() => ({}));

export interface PaymentOrdersProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The content name used to prefilter the results shown
   */
  contentName?: string;
  /**
   * The content type used to prefilter the results shown
   */
  contentType?: SCContentType;
}

export default function PaymentOrders(inProps: PaymentOrdersProps) {
  // PROPS
  const props: PaymentOrdersProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentName = '', contentType = SCContentType.ALL, ...rest} = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setInvoices] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(contentName);
  const [contentTypeFilter, setContentTypeFilter] = useState(contentType);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const {ref, inView} = useInView({triggerOnce: false});
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONTEXT
  const scContext: SCContextType = useSCContext();

  //HANDLERS
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  /**
   * Handle change filter name
   * @param event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  /**
   * Handle content type change
   * @param event
   */
  const handleContentTypeChange = (event) => {
    setContentTypeFilter(event.target.value);
  };

  /**
   * Initial Invoices fetch
   */
  const fetchInvoices = async (searchValue: string = query) => {
    setIsLoading(true);
    setHasMore(true);
    setInvoices([]);
    try {
      const res = await PaymentService.getPaymentsOrder({
        offset: 0,
        ordering: '-created_at',
        ...(searchValue && {search: searchValue}),
        ...(contentTypeFilter && contentTypeFilter !== SCContentType.ALL && {content_type: contentTypeFilter}),
        ...(startDate && {created_at__gte: formatDate(startDate)}),
        ...(endDate && {created_at__lt: formatDate(endDate)})
      });
      if (res) {
        setInvoices(res.results);
        setHasMore(res.next !== null);
      }
    } catch (error) {
      Logger.error(SCOPE_SC_UI, error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Infinite load more orders
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingPage || isLoading) return;
    setIsLoadingPage(true);
    try {
      const res = await PaymentService.getPaymentsOrder({
        offset: orders.length,
        ordering: '-created_at',
        ...(query && {search: query}),
        ...(contentTypeFilter && contentTypeFilter !== SCContentType.ALL && {content_type: contentTypeFilter}),
        ...(startDate && {created_at__gte: formatDate(startDate)}),
        ...(endDate && {created_at__lt: formatDate(endDate)})
      });
      if (res) {
        setInvoices((prev) => prev.concat(res.results));
        setHasMore(res.next !== null);
      }
    } catch (error) {
      Logger.error(SCOPE_SC_UI, error);
    } finally {
      setIsLoadingPage(false);
    }
  }, [orders.length, query, hasMore, isLoadingPage, isLoading, contentTypeFilter, startDate, endDate]);

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
          variant="outlined"
          actions={<></>}
        />
      );
    } else if (contentType === SCContentType.GROUP) {
      return <Group group={content as SCGroupType} cacheStrategy={CacheStrategies.NETWORK_ONLY} hideActions variant="outlined" />;
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
  }, [inView, loadMore]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchInvoices();
  }, [contentTypeFilter, endDate]);

  if (!isPaymentsEnabled) {
    return <HiddenPlaceholder />;
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
    <Root variant="outlined" className={classNames(classes.root, className)} {...rest}>
      <Grid container className={classes.filters} gap={3}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <TextField
            className={classes.search}
            size={'small'}
            fullWidth
            value={query}
            label={<FormattedMessage id="ui.paymentOrders.search" defaultMessage="ui.paymentOrders.search" />}
            variant="outlined"
            onChange={handleChange}
            disabled={isLoading}
            onKeyUp={(e) => {
              e.preventDefault();
              if (e.key === 'Enter') {
                fetchInvoices();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {query.length > 0 && (
                    <IconButton
                      onClick={() => {
                        setQuery('');
                        fetchInvoices('');
                      }}
                      disabled={isLoading}>
                      <Icon>close</Icon>
                    </IconButton>
                  )}
                  {isMobile ? (
                    <IconButton onClick={() => fetchInvoices()} disabled={isLoading}></IconButton>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => fetchInvoices()}
                      endIcon={<Icon>search</Icon>}
                      disabled={isLoading}
                    />
                  )}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <TextField
            select
            fullWidth
            disabled={isLoading}
            size="small"
            label={<FormattedMessage id="ui.paymentOrders.contentTypeFilter" defaultMessage="ui.paymentOrders.contentTypeFilter" />}
            value={contentTypeFilter}
            onChange={handleContentTypeChange}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={8} md={4}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={scContext.settings.locale.default === 'it' ? itLocale : enLocale}
            localeText={{
              cancelButtonLabel: `${intl.formatMessage(messages.pickerCancelAction)}`,
              clearButtonLabel: `${intl.formatMessage(messages.pickerClearAction)}`
            }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MobileDatePicker
                  className={classes.picker}
                  label={<FormattedMessage id="ui.paymentOrders.dateFrom" defaultMessage="ui.paymentOrders.dateFrom" />}
                  value={startDate}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          placeholder: `${intl.formatMessage(messages.dateFrom)}`,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <Icon>CalendarIcon</Icon>
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ['cancel', 'clear', 'accept']
                    },
                    toolbar: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      toolbarTitle: <FormattedMessage id="ui.paymentOrders.picker.date" defaultMessage="ui.paymentOrders.picker.date" />
                    }
                  }}
                  onChange={(newValue) => setStartDate(newValue)}
                />
              </Grid>
              <Grid item xs={6}>
                <MobileDatePicker
                  className={classes.picker}
                  label={<FormattedMessage id="ui.paymentOrders.dateTo" defaultMessage="ui.paymentOrders.dateTo" />}
                  value={endDate}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          placeholder: `${intl.formatMessage(messages.dateTo)}`,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <Icon>CalendarIcon</Icon>
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ['cancel', 'clear', 'accept']
                    },
                    toolbar: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore,@typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      toolbarTitle: <FormattedMessage id="ui.paymentOrders.picker.date" defaultMessage="ui.paymentOrders.picker.date" />
                    }
                  }}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Box className={classes.content}>
        {!isLoading ? (
          <TableContainer style={{margin: 'auto', borderRadius: 0}}>
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
                    <TableCell scope="row">
                      <FormattedMessage
                        id={`ui.paymentOrders.contentType.${order.content_type}`}
                        defaultMessage={`ui.paymentOrders.contentType.${order.content_type}`}
                      />
                    </TableCell>
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
                      <Chip
                        variant={'outlined'}
                        label={<FormattedMessage id="ui.paymentOrders.status.paid" defaultMessage="ui.paymentOrders.status.paid" />}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell scope="row">
                      <Stack direction="row" justifyContent="left" alignItems="center" spacing={2}>
                        {order.content_type === SCContentType.EVENT && <PaymentOrderPdfButton paymentOrder={order} />}
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
                        <FormattedMessage id="ui.paymentOrders.noOrders" defaultMessage="ui.paymentOrders.noOrders" />
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
