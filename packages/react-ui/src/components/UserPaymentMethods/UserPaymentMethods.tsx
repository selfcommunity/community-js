import React, {forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Icon,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import {PaymentIcon, PaymentTypeExtended} from 'react-svg-credit-card-payment-icons';
import {SCUserContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import UserPaymentMethodsSkeleton from './Skeleton';
import {FormattedMessage, useIntl} from 'react-intl';
import {useInView} from 'react-intersection-observer';
import {useSnackbar} from 'notistack';
import {ConfirmDialog} from '@selfcommunity/react-ui';
import UserChangeAddressDialog from '../UserChangeAddressDialog';
import {PaymentMethod as StripePaymentMethod} from '@stripe/stripe-js';
import UserAddPaymentMethodDialog from '../UserAddPaymentMethodDialog';

const classes = {
  root: `${PREFIX}-root`,
  headline: `${PREFIX}-headline`,
  btnSave: `${PREFIX}-btn-save`,
  paymentNumber: `${PREFIX}-payment-number`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserPaymentMethodsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Show billing address
   */
  showBillingAddress?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type UserPaymentMethodsRef = {};

/**
 * > API documentation for the Community-JS User Payment Methods. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserPaymentMethods} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserPaymentMethods` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserPaymentMethods-root|Styles applied to the root element.|

 * @param inProps
 */
const UserPaymentMethods: ForwardRefRenderFunction<UserPaymentMethodsRef, UserPaymentMethodsProps> = (
  inProps: UserPaymentMethodsProps,
  ref: React.ForwardedRef<UserPaymentMethodsRef>
): JSX.Element => {
  // PROPS
  const props: UserPaymentMethodsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, showBillingAddress = false, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState<any>(null);
  const [editPaymentMethodDialogOpen, setEditPaymentMethodDialogOpen] = useState<boolean>(false);
  const [defaultPaymentMethodLoading, setDefaultPaymentMethodLoading] = useState<string | null>(null);
  const [deleteMethodId, setDeleteMethodId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [isDeletingPaymentMethod, setIsDeletingPaymentMethod] = useState<boolean>(false);
  const [addPaymentMethodDialogOpen, setAddPaymentMethodDialogOpen] = useState(false);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const intl = useIntl();
  const {inView} = useInView({triggerOnce: false});
  const {enqueueSnackbar} = useSnackbar();

  /**
   * Infinite load
   */
  const loadMore = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const loadItems = async () => {
      const startingAfterId = paymentMethods.length ? paymentMethods[paymentMethods.length - 1].id : null;
      /* getAccountCustomerPaymentMethod(startingAfterId).then((res) => {
        setHasMore(res.paymentMethods.has_more);
        setPaymentMethods(paymentMethods.concat(res.paymentMethods.data));
        setIsLoadingPage(false);
        setIsLoading(false);
      }); */
    };
    if (hasMore && !isLoadingPage) {
      setIsLoadingPage(true);
      await loadItems();
    }
  }, [paymentMethods, hasMore, isLoading, isLoadingPage]);

  /**
   * Handle delete payment method
   * @param id
   */
  const handleDelete = useCallback(
    (id: string) => {
      if (id) {
        setDeleteMethodId(id);
        setOpenDeleteDialog(true);
      }
    },
    [setDeleteMethodId, setOpenDeleteDialog]
  );

  /**
   * Handle confirm delete payment method
   */
  const handleConfirmDelete = async () => {
    /* setIsDeletingPaymentMethod(true);
    if (deleteMethodId) {
      const isDefaultMethodForSubscriptionsRes = await isPaymentMethodDefaultForCustomerSubscriptions(deleteMethodId);
      if (isDefaultMethodForSubscriptionsRes.error) {
        enqueueSnackbar(
          intl.formatMessage({
            id: 'paymentMethods.error.unableToRemoveMethod',
            defaultMessage: 'paymentMethods.error.unableToRemoveMethod'
          }),
          {
            variant: 'error',
            autoHideDuration: 3000
          }
        );
      } else if (isDefaultMethodForSubscriptionsRes.subscription) {
        enqueueSnackbar(
          intl.formatMessage({
            id: 'paymentMethods.error.unableToRemoveMethodSubscription',
            defaultMessage: 'paymentMethods.error.unableToRemoveMethodSubscription'
          }),
          {
            variant: 'error',
            autoHideDuration: 3000
          }
        );
      } else {
        const res = await detachPaymentMethodById(deleteMethodId);
        if (res.error) {
          enqueueSnackbar(
            intl.formatMessage({
              id: 'paymentMethods.error.unableToRemoveMethod',
              defaultMessage: 'paymentMethods.error.unableToRemoveMethod'
            }),
            {
              variant: 'error',
              autoHideDuration: 3000
            }
          );
        } else if (res.detachedPaymentMethod) {
          setPaymentMethods(paymentMethods.filter((m: Stripe.PaymentMethod) => m.id !== deleteMethodId));
          enqueueSnackbar(
            intl.formatMessage({
              id: 'paymentMethods.methodRemoved',
              defaultMessage: 'paymentMethods.methodRemoved'
            }),
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        }
      }
    }
    setIsDeletingPaymentMethod(false);
    setDeleteMethodId(null);
    setOpenDeleteDialog(false);
    */
  };

  const handleAddress = async (newAddress: any) => {
    // Perform delete paymentMethod
    /* if (newAddress) {
      const res = await updatePaymentMethodById(editPaymentMethod.id, newAddress);
      if (res.error) {
        enqueueSnackbar(
          intl.formatMessage({
            id: 'paymentMethods.error.unableToUpdateMethod',
            defaultMessage: 'paymentMethods.error.unableToUpdateMethod'
          }),
          {
            variant: 'error',
            autoHideDuration: 3000
          }
        );
      } else if (res.updatedPaymentMethod) {
        const _index = paymentMethods.findIndex((m) => m.id === editPaymentMethod.id);
        const _paymentMethods = [...paymentMethods];
        _paymentMethods[_index] = Object.assign({}, _paymentMethods[_index], {billing_details: newAddress});
        setPaymentMethods(_paymentMethods);
        enqueueSnackbar(
          intl.formatMessage({
            id: 'paymentMethods.methodUpdated',
            defaultMessage: 'paymentMethods.methodUpdated'
          }),
          {
            variant: 'success',
            autoHideDuration: 3000
          }
        );
      }
    }
    setEditPaymentMethodDialogOpen(false);
    setEditPaymentMethod(null); */
  };

  /**
   * Handle open edit address dialog
   * @param method
   */
  const handleOpenEditAddressDialog = (method) => {
    setEditPaymentMethod(method);
    setEditPaymentMethodDialogOpen(true);
  };

  /**
   * Handle set default payment method
   * @param paymentMethodId
   */
  const handleSetDefaultPaymentMethodId = async (paymentMethodId?: string) => {
    /* if (paymentMethodId) {
      setDefaultPaymentMethodLoading(paymentMethodId);
      if (defaultPaymentMethodId === paymentMethodId) {
        const res = await unsetCustomerDefaultPaymentMethod();
        if (res.error) {
          enqueueSnackbar(
            intl.formatMessage({
              id: 'paymentMethods.error.unableToSetMethodAsDefault',
              defaultMessage: 'paymentMethods.error.unableToSetMethodAsDefault'
            }),
            {
              variant: 'error',
              autoHideDuration: 3000
            }
          );
        } else {
          setDefaultPaymentMethodId(null);
          enqueueSnackbar(
            intl.formatMessage({
              id: 'paymentMethods.methodDefaultRemoved',
              defaultMessage: 'paymentMethods.methodDefaultRemoved'
            }),
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        }
      } else {
        const res = await setCustomerDefaultPaymentMethod(paymentMethodId);
        if (res.error) {
          enqueueSnackbar(
            intl.formatMessage({
              id: 'paymentMethods.error.unableToSetMethodAsDefault',
              defaultMessage: 'paymentMethods.error.unableToSetMethodAsDefault'
            }),
            {
              variant: 'error',
              autoHideDuration: 3000
            }
          );
        } else if (res.defaultPaymentMethodId) {
          setDefaultPaymentMethodId(res.defaultPaymentMethodId);
          enqueueSnackbar(
            intl.formatMessage({
              id: 'paymentMethods.methodDefaultConfigured',
              defaultMessage: 'paymentMethods.methodDefaultConfigured'
            }),
            {
              variant: 'success',
              autoHideDuration: 3000
            }
          );
        }
      }
      setDefaultPaymentMethodLoading(null);
    } */
  };

  /**
   * Handle confirm dialog close
   */
  const handleConfirmClose = () => {
    setDeleteMethodId(null);
    setOpenDeleteDialog(false);
  };

  /**
   * handle open add payment method dialog
   */
  const handleOpenAddPaymentMethodDialog = () => {
    setAddPaymentMethodDialogOpen(true);
  };

  /**
   * Handle payment method success
   * @param paymentMethod
   */
  const handlePaymentMethodSuccess = (paymentMethod: StripePaymentMethod) => {
    if (paymentMethod) {
      setPaymentMethods([paymentMethod, ...paymentMethods]);
    }
    setAddPaymentMethodDialogOpen(false);
  };

  /**
   * Load more payment methods
   */
  useEffect(() => {
    inView && loadMore();
  }, [inView]);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized, and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!initialized && !isLoading) {
        setInitialized(true);
        setIsLoading(true);
        /* getCustomerDefaultPaymentMethod().then((res) => {
					if (res.paymentMethod) {
						setDefaultPaymentMethodId(res.paymentMethod.id)
					}
					loadMore();
				});*/
      }
    },
    [isLoading, initialized]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user && !initialized) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, initialized]);

  if (!isPaymentsEnabled || !scUserContext.user) {
    return null;
  }

  return (
    <Root className={classes.root}>
      {isLoading ? (
        <UserPaymentMethodsSkeleton />
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="h3" className={classes.headline}>
              <FormattedMessage id="ui.userPaymentMethods.myPaymentMethods" defaultMessage="ui.userPaymentMethods.myPaymentMethods" />
            </Typography>
            {paymentMethods.length > 0 && (
              <Button size="small" variant={'outlined'} onClick={handleOpenAddPaymentMethodDialog}>
                <FormattedMessage id="ui.userPaymentMethods.btnAdd" defaultMessage="ui.userPaymentMethods.btnAdd" />
              </Button>
            )}
          </Stack>
          {paymentMethods.length > 0 ? (
            <TableContainer style={{margin: 'auto', borderRadius: 0}} component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id="ui.userPaymentMethods.typeMethod" defaultMessage="ui.userPaymentMethods.typeMethod" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="ui.userPaymentMethods.brand" defaultMessage="ui.userPaymentMethods.brand" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="ui.userPaymentMethods.expiration" defaultMessage="ui.userPaymentMethods.expiration" />
                    </TableCell>
                    {showBillingAddress && (
                      <TableCell>
                        <FormattedMessage id="ui.userPaymentMethods.billingDetails" defaultMessage="ui.userPaymentMethods.billingDetails" />
                      </TableCell>
                    )}
                    <TableCell>
                      <FormattedMessage id="ui.userPaymentMethods.default" defaultMessage="ui.userPaymentMethods.default" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="ui.userPaymentMethods.actions" defaultMessage="ui.userPaymentMethods.actions" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentMethods.map((method, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row">{method.type.toUpperCase()}</TableCell>
                      <TableCell scope="row">
                        {method.type === 'card' && (
                          <>
                            <PaymentIcon type={(method.card?.brand as PaymentTypeExtended) || 'Generic'} format="flatRounded" width={50} />
                            <Typography className={classes.paymentNumber}>**** **** **** {method.card?.last4}</Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell scope="row">
                        {method.card?.exp_month}/{method.card?.exp_year}
                      </TableCell>
                      {showBillingAddress && (
                        <TableCell scope="row">
                          <Stack direction="row" justifyContent="left" alignItems="center" spacing={2}>
                            <Box>
                              <Typography variant={'body1'}>{method.billing_details.name}</Typography>
                              <Typography variant={'body1'}>
                                {method.billing_details?.address?.line1}
                                <br />
                                {method.billing_details?.address?.line2}
                              </Typography>
                              <Typography variant={'body1'}>
                                {method.billing_details?.address?.postal_code} - {method.billing_details?.address?.city} -{' '}
                                {method.billing_details?.address?.country}
                              </Typography>
                            </Box>
                            <IconButton aria-label="edit" color="primary" onClick={() => handleOpenEditAddressDialog(method)}>
                              <Icon>edit</Icon>
                            </IconButton>
                          </Stack>
                        </TableCell>
                      )}
                      <TableCell scope="row">
                        {defaultPaymentMethodLoading === method.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <>
                            {method.id === defaultPaymentMethodId}
                            <Checkbox checked={method.id === defaultPaymentMethodId} onClick={() => handleSetDefaultPaymentMethodId(method.id)} />
                          </>
                        )}
                      </TableCell>
                      <TableCell scope="row">
                        <Button variant={'contained'} onClick={() => handleDelete(method.id)}>
                          <FormattedMessage id="ui.userPaymentMethods.btnRemove" defaultMessage="ui.userPaymentMethods.btnRemove" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {hasMore && <UserPaymentMethodsSkeleton />}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <>
              <Typography variant="body2" mb={2}>
                <FormattedMessage id="ui.userPaymentMethods.noPaymentMethods" defaultMessage="ui.userPaymentMethods.noPaymentMethods" />
              </Typography>
              <Button size="small" variant={'contained'} onClick={handleOpenAddPaymentMethodDialog}>
                <FormattedMessage id="ui.userPaymentMethods.btnAdd" defaultMessage="ui.userPaymentMethods.btnAdd" />
              </Button>
            </>
          )}
          {openDeleteDialog && (
            <ConfirmDialog
              open={openDeleteDialog}
              title={
                <FormattedMessage
                  id="ui.userPaymentMethods.dialog.confirmDeleteTitle"
                  defaultMessage="ui.userPaymentMethods.dialog.confirmDeleteTitle"
                />
              }
              btnConfirm={
                <FormattedMessage
                  id="ui.userPaymentMethods.dialog.confirmDeleteDescription"
                  defaultMessage="ui.userPaymentMethods.dialog.confirmDeleteDescription"
                />
              }
              onConfirm={handleConfirmDelete}
              onClose={handleConfirmClose}
              isUpdating={isDeletingPaymentMethod}
            />
          )}
          {editPaymentMethodDialogOpen && editPaymentMethod !== null && (
            <UserChangeAddressDialog open defaultAddress={editPaymentMethod} handleAddress={handleAddress} />
          )}
          {addPaymentMethodDialogOpen && <UserAddPaymentMethodDialog open handlePaymentMethod={handlePaymentMethodSuccess} />}
        </>
      )}
    </Root>
  );
};

export default forwardRef(UserPaymentMethods);
