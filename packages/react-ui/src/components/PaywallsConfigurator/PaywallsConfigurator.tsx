import React, {useEffect, useMemo, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  AutocompleteCloseReason,
  Avatar,
  Box,
  Button,
  Icon,
  InputBase,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Radio,
  Stack,
  Typography,
  Zoom,
	styled
} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Endpoints, http} from '@selfcommunity/api-services';
import {SCPaymentProduct, SCContentType, SCPurchasableContent, SCPaywall} from '@selfcommunity/types';
import {useSCPaymentsEnabled} from '@selfcommunity/react-core';
import {ContentAccessType, PREFIX} from './constants';
import PaywallsConfiguratorSkeleton from './Skeleton';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage, useIntl} from 'react-intl';
import {getConvertedAmount} from '../../utils/payment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import List from '@mui/material/List';
import CreatePaymentProductForm from '../CreatePaymentProductForm';

const classes = {
  root: `${PREFIX}-root`,
  paymentProductsAutocompletePopperRoot: `${PREFIX}-payment-products-autocomplete-popper-root`,
  paymentProductsPopperRoot: `${PREFIX}-payment-products-popper-root`,
  filterInputRoot: `${PREFIX}-filter-input-root`,
  contentAccessType: `${PREFIX}-content-access-type`,
  newProduct: `${PREFIX}-new-product`,
  noProducts: `${PREFIX}-no-products`,
  error: `${PREFIX}-error`,
  selectedPaymentProductsList: `${PREFIX}-selected-payment-products-list`,
  autoCompleteFooter: `${PREFIX}-autocomplete-footer`,
  btnAddPaymentProduct: `${PREFIX}-add-payment-product`,
  paymentProductsPopperTitle: `${PREFIX}-payment-products-popper-title`,
  paymentProductsPopperFooter: `${PREFIX}-payment-products-popper-footer`,
  productItemCheckIcon: `${PREFIX}-product-check-icon`,
  productItemCardIcon: `${PREFIX}-product-card-icon`,
  productItemContent: `${PREFIX}-product-content`,
  productItemRemoveIcon: `${PREFIX}-product-remove-icon`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(() => ({}));

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

const PaymentProductsAutocompletePopper = styled(Box, {
  name: PREFIX,
  slot: 'PaymentProductsAutocompletePopperRoot',
  overridesResolver: (_props, styles) => styles.paymentProductsAutocompletePopperRoot
})(() => ({}));

const PaymentProductsPopper = styled(Popper, {
  name: PREFIX,
  slot: 'PaymentProductsPopperRoot',
  overridesResolver: (_props, styles) => styles.paymentProductsPopperRoot
})(() => ({}));

const FilterInputRoot = styled(InputBase, {
  name: PREFIX,
  slot: 'FilterInputRoot',
  overridesResolver: (_props, styles) => styles.filterInputRoot
})(() => ({}));

function PopperComponent(props: PopperComponentProps) {
  const {disablePortal, anchorEl, open, ...other} = props;
  return <PaymentProductsAutocompletePopper {...other} />;
}

export interface PaywallsConfiguratorProps {
  className?: string;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  prefetchedProducts?: SCPaymentProduct[];
  selectedProducts?: SCPaymentProduct[];
  onChangePaymentProducts?: (products: SCPaymentProduct[]) => void;
  onChangeContentAccessType?: (type: string) => void;
  disabled?: boolean;
}

export default function PaywallsConfigurator(inProps: PaywallsConfiguratorProps) {
  // PROPS
  const props: PaywallsConfiguratorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    contentId,
    contentType,
    content,
    prefetchedProducts,
    selectedProducts = [],
    onChangeContentAccessType,
    onChangePaymentProducts,
    disabled = false,
    ...rest
  } = props;

  // STATE
  const [products, setProducts] = useState<SCPaymentProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [value, setValue] = React.useState<SCPaymentProduct[]>(selectedProducts);
  const [pendingValue, setPendingValue] = React.useState<SCPaymentProduct[]>([]);
  const [expanded, setExpanded] = React.useState<string | false>(value.length ? ContentAccessType.PAID : ContentAccessType.FREE);
  const [createPrice, setCreatePrice] = useState<boolean>(false);

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const intl = useIntl();

  // CONST
  const open = Boolean(anchorEl);

  /**
   * Handle change content type access
   * @param panel
   */
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPendingValue(value);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setValue(pendingValue);
		onChangePaymentProducts?.(pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  /**
   * Handlers for manage create payment product form
   */

  const handleToggleCreatePaymentPrice = () => {
    setCreatePrice((prev) => !prev);
  };

  const handleCreatePaymentPrice = (product: SCPaymentProduct) => {
    const products = [product, ...value];
    setValue([product, ...value]);
		onChangePaymentProducts?.(products);
    handleToggleCreatePaymentPrice();
  };

  const handleDeleteProduct = (p, i) => {
    const products = [...value.slice(0, i), ...value.slice(i + 1)];
    setValue(products);
		onChangePaymentProducts?.(products);
  };

  /**
   * Get the list of option
   * Display the selected first.
   */
  const getOptions = useMemo((): SCPaymentProduct[] => {
    return [...products].sort((a, b) => {
      let ai = value.indexOf(a);
      ai = ai === -1 ? value.length + products.indexOf(a) : ai;
      let bi = value.indexOf(b);
      bi = bi === -1 ? value.length + products.indexOf(b) : bi;
      return ai - bi;
    });
  }, [products.length, value.length]);

  /**
   * Render single option
   * @param props
   * @param option
   * @param selected
   */
  const renderOption = (props, option, {selected}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {key, ...optionProps} = props;
    return (
      <li key={option.id} {...optionProps} {...(selected && {style: {backgroundColor: '#f9fafc'}})}>
        <Box className={classes.productItemCheckIcon} style={{visibility: selected ? 'visible' : 'hidden'}}>
          <Icon>check</Icon>
        </Box>
        <Box component="span" className={classes.productItemCardIcon}>
          <Icon>card_giftcard</Icon>
        </Box>
        <Box className={classes.productItemContent}>
          {option.name}
          <br />
          {option.payment_prices && option.payment_prices[0] && (
            <>
              <span>{getConvertedAmount(option.payment_prices[0])}</span>{' '}
              {option.payment_prices.length > 1 && <>+{option.payment_prices.length - 1}</>}
            </>
          )}
        </Box>
        <Box className={classes.productItemRemoveIcon} style={{visibility: selected ? 'visible' : 'hidden'}}>
          <Icon>arrow</Icon>
        </Box>
      </li>
    );
  };

  /**
   * Fetch events
   */
  const fetchPaymentProducts = async (
    next = `${Endpoints.GetPaymentProducts.url({})}?content_id=${contentId}&content_type=${contentType}`
  ): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetPaymentProducts.method
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchPaymentProducts(data.next));
    }
    return data.results;
  };

  /**
   * Fetch paywalls
   */
  const fetchPaywalls = async (
    next = `${Endpoints.GetPaywalls.url({})}?content_id=${contentId}&content_type=${contentType}&active=1`
  ): Promise<SCPaywall[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetPaywalls.method
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchPaywalls(data.next));
    }
    return data.results;
  };

  const initSelectProducts = () => {
    if ((content || contentId !== undefined) && contentType) {
      fetchPaywalls()
        .then((paywalls) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const products = paywalls.map((p) => p.payment_product);
          setValue(products);
          setPendingValue(products);
          setExpanded(products.length ? ContentAccessType.PAID : ContentAccessType.FREE);
          setLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    } else {
      setExpanded(ContentAccessType.FREE);
      setLoading(false);
    }
  };

  /**
   * On mount, fetch payment content status
   */
  useEffect(() => {
    if (prefetchedProducts) {
      setProducts(prefetchedProducts);
      initSelectProducts();
    } else {
      fetchPaymentProducts()
        .then((data) => {
          setProducts(data);
          initSelectProducts();
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [prefetchedProducts, contentId, contentType]);

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {loading ? (
        <PaywallsConfiguratorSkeleton />
      ) : (
        <div className={classes.contentAccessType}>
          <Typography>
            <FormattedMessage id="ui.paywallsConfigurator.selectAccessType" defaultMessage="ui.paywallsConfigurator.selectAccessType" />
          </Typography>
          <Accordion
            expanded={expanded === ContentAccessType.FREE}
            onChange={handleChange(ContentAccessType.FREE)}
            disabled={disabled || loading}
            variant="outlined">
            <AccordionSummary expandIcon={<Radio checked={expanded === ContentAccessType.FREE} />} aria-controls="free-content" id="free-header">
              <Typography>
                <b>
                  <FormattedMessage id="ui.paywallsConfigurator.free" defaultMessage="ui.paywallsConfigurator.free" />
                </b>
                : <FormattedMessage id="ui.paywallsConfigurator.free.label" defaultMessage="ui.paywallsConfigurator.free.label" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <FormattedMessage id="ui.paywallsConfigurator.free.info" defaultMessage="ui.paywallsConfigurator.free.info" />
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === ContentAccessType.PAID}
            onChange={handleChange(ContentAccessType.PAID)}
            disabled={disabled || loading}
            variant="outlined">
            <AccordionSummary expandIcon={<Radio checked={expanded === ContentAccessType.PAID} />} aria-controls="paid-content" id="paid-header">
              <Typography>
                <b>
                  <FormattedMessage id="ui.paywallsConfigurator.paid" defaultMessage="ui.paywallsConfigurator.paid" />
                </b>
                : <FormattedMessage id="ui.paywallsConfigurator.paid.label" defaultMessage="ui.paywallsConfigurator.paid.label" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography mb={2}>
                <FormattedMessage id="ui.paywallsConfigurator.paid.info" defaultMessage="ui.paywallsConfigurator.paid.info" />
              </Typography>
              <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={2}>
                <Typography style={{flexGrow: 1}} component="div">
                  <b>
                    <FormattedMessage id="ui.paywallsConfigurator.connected.products" defaultMessage="ui.paywallsConfigurator.connected.products" />
                  </b>
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  disableRipple
                  onClick={handleToggleCreatePaymentPrice}
                  startIcon={<Icon>add</Icon>}
                  className={classes.btnAddPaymentProduct}>
                  <FormattedMessage
                    id="ui.paywallsConfigurator.connected.products.btnNew"
                    defaultMessage="ui.paywallsConfigurator.connected.products.btnNew"
                  />
                </Button>
              </Stack>
              {loading ? (
                <PaywallsConfiguratorSkeleton />
              ) : (
                <Box>
                  {createPrice && (
                    <Zoom in={createPrice}>
                      <Box>
                        <CreatePaymentProductForm
                          className={classes.newProduct}
                          onCreate={handleCreatePaymentPrice}
                          onCancel={handleToggleCreatePaymentPrice}
                        />
                      </Box>
                    </Zoom>
                  )}
                  <List dense className={classes.selectedPaymentProductsList}>
                    {!value.length && (
                      <ListItem key={-1} className={classes.noProducts} divider>
                        <ListItemText
                          primary={intl.formatMessage({
                            id: 'ui.paywallsConfigurator.connected.noProducts',
                            defaultMessage: 'ui.paywallsConfigurator.connected.noProducts'
                          })}
                        />
                      </ListItem>
                    )}
                    {value.map((p, i) => {
                      return (
                        <ListItem
                          key={i}
                          secondaryAction={
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={() => handleDeleteProduct(p, i)}
                              startIcon={<Icon>delete</Icon>}>
                              <FormattedMessage
                                id="ui.paywallsConfigurator.connected.products.btnRemove"
                                defaultMessage="ui.paywallsConfigurator.connected.products.btnRemove"
                              />
                            </Button>
                          }
                          divider>
                          <ListItemAvatar>
                            <Avatar>
                              <Icon>card_giftcard</Icon>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={p.name}
                            secondary={`Prices: ${
                              p.payment_prices?.length
                                ? p.payment_prices
                                    .slice(0, 3)
                                    .map((price) => getConvertedAmount(price))
                                    .join(' - ')
                                : '-'
                            } ${
                              p.payment_prices?.length > 3
                                ? intl.formatMessage(
                                    {
                                      id: 'ui.paywallsConfigurator.connected.products.others',
                                      defaultMessage: 'ui.paywallsConfigurator.connected.products.others'
                                    },
                                    {count: p.payment_prices?.length - 3}
                                  )
                                : ''
                            }`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  <Button variant="outlined" size="small" fullWidth disableRipple onClick={handleClick} startIcon={<Icon>list</Icon>}>
                    Add selecting price from list
                  </Button>
                </Box>
              )}
              {!loading && (
                <PaymentProductsPopper id={open ? 'payment-products' : undefined} open={open} anchorEl={anchorEl} placement="bottom-start">
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box>
                      <Box className={classes.paymentProductsPopperTitle}>
                        <FormattedMessage
                          id="ui.paywallsConfigurator.connected.products.content"
                          defaultMessage="ui.paywallsConfigurator.connected.products.content"
                        />
                      </Box>
                      <Autocomplete
                        open
                        multiple
                        onClose={(event, reason: AutocompleteCloseReason) => {
                          if (reason === 'escape') {
                            handleClose();
                          }
                        }}
                        value={pendingValue}
                        onChange={(event, newValue, reason) => {
                          if (
                            event.type === 'keydown' &&
                            ((event as React.KeyboardEvent).key === 'Backspace' || (event as React.KeyboardEvent).key === 'Delete') &&
                            reason === 'removeOption'
                          ) {
                            return;
                          }
                          setPendingValue(newValue);
                        }}
                        disableCloseOnSelect
                        PopperComponent={PopperComponent}
                        renderTags={() => null}
                        noOptionsText={
                          <FormattedMessage id="ui.paywallsConfigurator.noProducts" defaultMessage="ui.paywallsConfigurator.noProducts" />
                        }
                        renderOption={renderOption}
                        options={getOptions}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.name.toString()}
                        renderInput={(params) => (
                          <FilterInputRoot
                            ref={params.InputProps.ref}
                            inputProps={params.inputProps}
                            autoFocus
                            placeholder={intl.formatMessage({
                              id: 'ui.paywallsConfigurator.filterByName',
                              defaultMessage: 'ui.paywallsConfigurator.filterByName'
                            })}
                          />
                        )}
                      />
                      <Box className={classes.paymentProductsPopperFooter}>
                        <Button variant="contained" size="small" disableRipple onClick={handleClose} startIcon={<Icon>check</Icon>}>
                          <FormattedMessage
                            id="ui.paywallsConfigurator.popper.btnConfirm"
                            defaultMessage="ui.paywallsConfigurator.popper.btnConfirm"
                          />
                        </Button>
                      </Box>
                    </Box>
                  </ClickAwayListener>
                </PaymentProductsPopper>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </Root>
  );
}
