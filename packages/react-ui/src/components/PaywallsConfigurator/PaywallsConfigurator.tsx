import React, {useEffect, useMemo, useState} from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	autocompleteClasses,
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
	Slide,
	Stack,
	Typography,
	useTheme, Zoom
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Endpoints, http} from '@selfcommunity/api-services';
import {SCPaymentProduct, SCContentType, SCPurchasableContent, SCPaywall} from '@selfcommunity/types';
import {SCThemeType, useSCPaymentsEnabled} from '@selfcommunity/react-core';
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
import {grey} from '@mui/material/colors';
import Grow from '@mui/material/Grow';

const classes = {
  root: `${PREFIX}-root`,
  contentAccessType: `${PREFIX}-content-access-type`,
  newProduct: `${PREFIX}-new-product`,
  noProducts: `${PREFIX}-no-products`,
  error: `${PREFIX}-error`,
  selectedPaymentProductsList: `${PREFIX}-selected-payment-products-list`,
  autoCompleteFooter: `${PREFIX}-autocomplete-footer`,
  btnAddPaymentProduct: `${PREFIX}-add-payment-product`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({
  [`& .${classes.newProduct}`]: {
    background: '#eeeeee',
    padding: theme.spacing(2),
    marginTop: theme.spacing(),
    borderRadius: theme.spacing(1)
  },
  [`& .${classes.noProducts}`]: {
    textDecoration: 'italic',
    paddingLeft: 0,
    color: grey[400]
  },
  [`& .${classes.contentAccessType}`]: {
    '& .MuiPaper-root': {
      borderColor: '#c6c6c6'
    },
    '& .MuiAccordion-root:first-of-type': {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5
    },
    '& .MuiAccordion-root:last-of-type': {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5
    },
    [`& .${classes.selectedPaymentProductsList}`]: {
      borderTop: '1px solid',
      marginTop: 10
    },
    [`& .${classes.btnAddPaymentProduct}`]: {
      position: 'relative',
      left: -23,
      '& .MuiButton-startIcon': {
        fontSize: '15px'
      }
    }
  }
}));

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

const StyledAutocompletePopper = styled('div')(({theme}) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: 'none',
    margin: 0,
    color: 'inherit',
    fontSize: 13
  },
  [`& .${autocompleteClasses.listbox}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      padding: 8,
      borderBottom: `1px solid  ${theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'}`,
      '&[aria-selected="true"]': {
        backgroundColor: 'transparent'
      },
      [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]: {
        backgroundColor: theme.palette.action.hover
      }
    }
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: 'relative'
  },
  [`& .${classes.autoCompleteFooter}`]: {
    backgroundColor: grey[400]
  }
}));

function PopperComponent(props: PopperComponentProps) {
  const {disablePortal, anchorEl, open, ...other} = props;
  return <StyledAutocompletePopper {...other} />;
}

const StyledPopper = styled(Popper)(({theme}) => ({
  border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
  boxShadow: `0 8px 24px ${theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'}`,
  borderRadius: 6,
  width: 300,
  zIndex: theme.zIndex.modal,
  fontSize: 13,
  color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
  '& .MuiPaper-root': {
    borderRadius: 0
  }
}));

const StyledInput = styled(InputBase)(({theme}) => ({
  padding: 10,
  width: '100%',
  borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
  '& input': {
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
    padding: 8,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    border: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
    fontSize: 14,
    '&:focus': {
      boxShadow: `0px 0px 0px 3px ${theme.palette.mode === 'light' ? 'rgba(3, 102, 214, 0.3)' : 'rgb(12, 45, 107)'}`,
      borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd'
    }
  }
}));

export interface PaywallsConfiguratorProps {
  className?: string;
  contentType?: SCContentType;
  contentId?: number | string;
  content?: SCPurchasableContent;
  prefetchedProducts?: SCPaymentProduct[];
  selectedProducts?: SCPaymentProduct[];
  onChange?: (products: SCPaymentProduct[]) => void;
  disabled?: boolean;
}

export default function PaywallsConfigurator(inProps: PaywallsConfiguratorProps) {
  // PROPS
  const props: PaywallsConfiguratorProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contentId, contentType, content, prefetchedProducts, selectedProducts = [], onChange, disabled = false, ...rest} = props;

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
  const theme = useTheme<SCThemeType>();
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
    onChange?.(pendingValue);
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
    onChange?.(products);
    handleToggleCreatePaymentPrice();
  };

  const handleDeleteProduct = (p, i) => {
    const products = [...value.slice(0, i), ...value.slice(i + 1)];
    setValue(products);
    onChange?.(products);
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
      <li key={key} {...optionProps} {...(selected && {style: {backgroundColor: '#f9fafc'}})}>
        <Box
          sx={{width: 17, height: 17, mr: '5px', ml: '-1px', mt: '3px'}}
          style={{
            visibility: selected ? 'visible' : 'hidden'
          }}>
          <Icon>check</Icon>
        </Box>
        <Box
          component="span"
          sx={{
            width: 14,
            height: 14,
            flexShrink: 0,
            borderRadius: '3px',
            mr: 1,
            mt: '2px',
            p: '3px'
          }}
          style={{backgroundColor: 'red', color: 'white'}}>
          <Icon>card_giftcard</Icon>
        </Box>
        <Box
          sx={(t) => ({
            flexGrow: 1,
            '& span': {
              color: '#8b949e'
            }
          })}>
          {option.name}
          <br />
          {option.payment_prices && option.payment_prices[0] && (
            <>
              <span>{getConvertedAmount(option.payment_prices[0])}</span>{' '}
              {option.payment_prices.length > 1 && <>+{option.payment_prices.length - 1}</>}
            </>
          )}
        </Box>
        <Box
          sx={{opacity: 0.6, width: 18, height: 18}}
          style={{
            visibility: selected ? 'visible' : 'hidden'
          }}>
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
          <Typography mb={1}>Seleziona il tipo di accesso al contenuto</Typography>
          <Accordion
            expanded={expanded === ContentAccessType.FREE}
            onChange={handleChange(ContentAccessType.FREE)}
            disabled={disabled || loading}
            variant="outlined">
            <AccordionSummary expandIcon={<Radio checked={expanded === ContentAccessType.FREE} />} aria-controls="free-content" id="free-header">
              <Typography>
                <b>FREE</b>: contenuto gratuito
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Un contenuto ad uso gratuito è un contenuto accessibile senza alcun costo per l'utente. Non è previsto nessun paywall e quindi non
                richiede nessun pagamento o abbonamento.
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
                <b>A PAGAMENTO</b>: contenuto a pagamento
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography mb={2}>
                Il contenuto è accessibile solo previo pagamento, che può avvenire tramite acquisto singolo o abbonamento.
              </Typography>
              <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={2}>
                <Typography style={{flexGrow: 1}} component="div">
                  <b>Prezzi associati</b>
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  disableRipple
                  onClick={handleToggleCreatePaymentPrice}
                  startIcon={<Icon>add</Icon>}
                  className={classes.btnAddPaymentProduct}>
                  New
                </Button>
              </Stack>
              {loading ? (
                <PaywallsConfiguratorSkeleton />
              ) : (
                <Box>
                  <List dense className={classes.selectedPaymentProductsList}>
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
                    {!value.length && (
                      <ListItem key={-1} className={classes.noProducts} divider>
                        <ListItemText primary={'Al momento nessun prezzo associato'} />
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
                              Remove
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
                            } ${p.payment_prices?.length > 3 ? `+ altri ${p.payment_prices?.length - 3}` : ''}`}
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
                <StyledPopper id={open ? 'payment-products' : undefined} open={open} anchorEl={anchorEl} placement="bottom-start">
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box>
                      <Box
                        sx={{
                          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#eaecef' : '#30363d'}`,
                          padding: '8px 10px',
                          fontWeight: 600
                        }}>
                        Prezzi applicabili al contenuto
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
                          <StyledInput
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
                      <Box sx={{borderTop: '1px solid #eaecef', padding: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Button
                          variant="contained"
                          size="small"
                          disableRipple
                          onClick={handleClose}
                          startIcon={<Icon style={{fontSize: 12}}>check</Icon>}
                          sx={{padding: '2px 8px'}}>
                          Conferma
                        </Button>
                      </Box>
                    </Box>
                  </ClickAwayListener>
                </StyledPopper>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </Root>
  );
}
