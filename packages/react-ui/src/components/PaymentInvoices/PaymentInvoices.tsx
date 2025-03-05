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
import {useSnackbar} from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';
// import InvoicePdfViewButton from '../../../../../../../../@customization/components/ui/InvoicePdfViewButton';
import {useInView} from 'react-intersection-observer';
import {getConvertedAmount} from '../../utils/payment';
import {UserService} from '@selfcommunity/api-services';

const PREFIX = 'SCPaymentInvoices';

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
    padding: '30px 10px'
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

export interface PaymentInvoicesProps {
  portal?: string;
}

export default function Invoices({portal}: PaymentInvoicesProps) {
  // HOOKS
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const {ref, inView} = useInView({triggerOnce: false});
  const intl = useIntl();

  // CHECKOUT
  const [invoiceCheckout, setInvoiceCheckout] = useState<any | null>(null);
  const [loadingCheckoutInvoiceId, setLoadingCheckoutInvoiceId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [communityId, setCommunityId] = useState<string | number | undefined>(undefined);

  // CONTEXT
  const {enqueueSnackbar} = useSnackbar();

  /**
   * Infinite load more invoices
   */
  const loadMore = useCallback(async () => {
    const loadItems = async () => {
      const startingAfterId = invoices.length ? invoices[invoices.length - 1].id : undefined;
      try {
        const history = await UserService.getOrderHistory();
        if (history) {
          /* setHasMore(res.invoices.has_more);
						setInvoices(invoices.concat(res.invoices.data));
						setIsLoadingPage(false);
						setIsLoading(false); */
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (hasMore && !isLoadingPage) {
      setIsLoadingPage(true);
      await loadItems();
    }
  }, [invoices, isLoadingPage, isLoading, hasMore]);

  const handlePayInvoice = (invoice) => {
    /* if (invoice.payment_intent) {
      setLoadingCheckoutInvoiceId(invoice.id);
      setInvoiceCheckout(invoice);
      getPaymentIntent(invoice.payment_intent as string).then((res) => {
        if (res.error) {
          enqueueSnackbar(<FormattedMessage id="pwa.common.error" defaultMessage="pwa.common.error" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        } else {
          if (invoice.subscription_details?.metadata?.community_id) {
            setCommunityId(invoice.subscription_details.metadata.community_id);
          }
          setClientSecret(res.paymentIntent.client_secret);
          setLoadingCheckoutInvoiceId(null);
        }
      });
    } else {
      enqueueSnackbar(<FormattedMessage id="pwa.common.error" defaultMessage="pwa.common.error" />, {
        variant: 'error',
        autoHideDuration: 3000
      });
    } */
  };

  /**
   * Handle back from checkout
   */
  const handleBackFromCheckout = () => {
    setClientSecret(null);
    setCommunityId(undefined);
  };

  const renderCheckout = () => {
    /* const _options: StripeElementsOptions = clientSecret ? {clientSecret} : {};
    return (
      <CheckoutDialog
        stripeElementsComponentOptions={_options}
        CheckoutFormComponentProps={{
          ...(clientSecret && {clientSecret: clientSecret}),
          portal: portal,
          applicationId: communityId,
          invoice: invoiceCheckout,
          handleBack: handleBackFromCheckout,
          returnUrl: `${portal}/dashboard/account/invoices`
        }}
      />
    ); */
  };

  /**
   * Load more invoices
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

  /**
   * Render skeleton
   */
  const skeleton = () => {
    return (
      <TableRow ref={ref}>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={110} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={60} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={130} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={150} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={65} />
        </TableCell>
        <TableCell component="th" scope="row">
          <Skeleton variant="text" height={40} width={145} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Root className={classes.root}>
      <Box className={classes.content}>
        {!isLoading ? (
          <>
            {clientSecret ? (
              <>{renderCheckout()}</>
            ) : (
              <>
                <Typography variant="h3" className={classes.headline}>
                  <FormattedMessage id="invoices.myInvoices" defaultMessage="invoices.myInvoices" />
                </Typography>
                <TableContainer style={{margin: 'auto', borderRadius: 0}} component={Paper}>
                  <Table sx={{minWidth: 650}} aria-label="simple table" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell width="15%">
                          <FormattedMessage id="invoices.invoiceNumber" defaultMessage="invoices.invoiceNumber" />
                        </TableCell>
                        <TableCell width="10%">
                          <FormattedMessage id="invoices.invoiceAmount" defaultMessage="invoices.invoiceAmount" />
                        </TableCell>
                        <TableCell width="20%">
                          <FormattedMessage id="invoices.invoiceEffectiveAt" defaultMessage="invoices.invoiceEffectiveAt" />
                        </TableCell>
                        <TableCell width="20%">
                          <FormattedMessage id="invoices.invoiceBillingAddress" defaultMessage="invoices.invoiceBillingAddress" />
                        </TableCell>
                        <TableCell width="10%">
                          <FormattedMessage id="invoices.status" defaultMessage="invoices.status" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage id="invoices.actions" defaultMessage="invoices.actions" />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice, index) => (
                        <TableRow key={index}>
                          <TableCell scope="row">
                            <b>{invoice.number}</b>
                          </TableCell>
                          <TableCell scope="row">{getConvertedAmount(invoice.amount_due)}</TableCell>
                          <TableCell scope="row">
                            {invoice.effective_at &&
                              intl.formatDate(new Date(invoice.created * 1000), {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                              })}
                          </TableCell>
                          <TableCell scope="row">
                            {invoice.customer_name && <Typography variant={'body1'}>{invoice.customer_name}</Typography>}
                            {invoice.customer_address && (
                              <>
                                <Typography variant={'body1'}>
                                  {invoice.customer_address.line1 && invoice.customer_address.line1}
                                  <br />
                                  {invoice.customer_address.line2 && invoice.customer_address.line2}
                                </Typography>
                                <Typography variant={'body1'}>
                                  {invoice.customer_address.postal_code} - {invoice.customer_address.city} - {invoice.customer_address.country}
                                </Typography>
                              </>
                            )}
                          </TableCell>
                          <TableCell scope="row">
                            {invoice.paid ? (
                              <Chip variant={'outlined'} label="Pagata" color="success" size="small" />
                            ) : (
                              <Chip
                                size="small"
                                variant={'outlined'}
                                label={intl.formatMessage({
                                  id: 'invoices.notPaid',
                                  defaultMessage: 'invoices.notPaid'
                                })}
                                color="error"
                              />
                            )}
                          </TableCell>
                          <TableCell scope="row">
                            <Stack direction="row" justifyContent="left" alignItems="center" spacing={2}>
                              {/* <InvoicePdfViewButton
                                size="small"
                                variant="contained"
                                InvoicePdfViewDialogProps={{
                                  InvoicePdfViewProps: {invoice, hideDownloadLink: true, maxWidth: 1280}
                                }}
                              />*/}
                              {Boolean(!invoice.paid && invoice.billing_reason === 'subscription_create') && (
                                <LoadingButton
                                  size="small"
                                  variant="contained"
                                  disabled={Boolean(loadingCheckoutInvoiceId && loadingCheckoutInvoiceId === invoice.id)}
                                  loading={Boolean(loadingCheckoutInvoiceId && loadingCheckoutInvoiceId === invoice.id)}
                                  onClick={() => handlePayInvoice(invoice)}>
                                  <FormattedMessage id="invoices.payInvoice" defaultMessage="invoices.payInvoice" />
                                </LoadingButton>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {invoices.length < 1 && (
                        <TableRow>
                          <TableCell align="left" colSpan={6}>
                            <Typography variant="body2">
                              <TableCell>
                                <FormattedMessage id="invoices.noInvoices" defaultMessage="invoices.noInvoices" />
                              </TableCell>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {hasMore && <>{skeleton()}</>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Root>
  );
}
