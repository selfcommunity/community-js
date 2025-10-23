import React, {forwardRef, ForwardRefRenderFunction, Fragment, useEffect, useImperativeHandle, useReducer, useRef, useState} from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import {camelCase} from '@selfcommunity/utils';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {FormattedMessage, useIntl} from 'react-intl';
import {UserBillingInfoMode, VAT_EXAMPLE} from '../../constants/Billing';
import {reducer, getInitialState, actionTypes} from './reducer';
import {SCCustomerBillingInfo} from '@selfcommunity/types/src/types';
import {countries, COUNTRY_CODES} from '../../constants/Country';
import UserBillingInfoSkeleton from './Skeleton';
import Grow from '@mui/material/Grow';
import {useSnackbar} from 'notistack';
// import {getCountryOption} from '../../utils/address';
import {SCUserContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
  textBox: `${PREFIX}-textbox`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  [`& .${classes.label}`]: {
    fontSize: '18px',
    color: 'rgb(48, 49, 61)'
  },
  [`& .${classes.error}`]: {
    color: theme.palette.secondary.main
  }
}));

export interface UserBillingInfoProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  id?: string;
  inlineDisplay?: boolean;
  buttonLabel?: JSX.Element;
  mode?: UserBillingInfoMode;
  onLoad?: (account: SCCustomerBillingInfo, isCustomerCompleted: boolean) => void;
  onChange?: (account: SCCustomerBillingInfo) => void;
  onSave?: (account: SCCustomerBillingInfo) => void;
  onError?: (error: any) => void;
  onBack?: () => void;
  onChangeViewMode?: (mode: UserBillingInfoMode) => void;
  disableButtons?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * BillingInfo component interface reference
 */
export type UserBillingInfoRef = {
  isBillingInfoCompleted: () => boolean;
  showError: (e: string) => void;
  billingMode: () => UserBillingInfoMode;
};

/**
 * > API documentation for the Community-JS UserBillingInfo. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserBillingInfo} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserBillingInfo` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserBillingInfo-root|Styles applied to the root element.|

 * @param inProps
 * @param ref
 */
const UserBillingInfo: ForwardRefRenderFunction<UserBillingInfoRef, UserBillingInfoProps> = (
  inProps: UserBillingInfoProps,
  ref: React.ForwardedRef<UserBillingInfoRef>
): JSX.Element => {
  // PROPS
  const props: UserBillingInfoProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = PREFIX,
    className,
    buttonLabel = <FormattedMessage id="ui.userBillingInfo.save" defaultMessage="ui.userBillingInfo.save" />,
    mode = UserBillingInfoMode.EDIT,
    onLoad,
    onSave,
    onError,
    inlineDisplay = false,
    onChange,
    onBack,
    onChangeViewMode,
    disableButtons = false,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const [state, dispatch] = useReducer(reducer, getInitialState({mode}));
  const [customer] = useState();

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const {enqueueSnackbar} = useSnackbar();
  const intl = useIntl();

  // REFS
  const componentRef = useRef(null);

  const getStripeAccountData = () => {
    const _state: any = {name: '', address: {}, phone: '', metadata: {}};
    _state.name = (state.name || '').trim();
    _state.phone = (state.phone || '').trim();
    _state.address.city = (state.address_city || '').trim();
    _state.address.country = (state.address_country?.code || '').trim();
    _state.address.line1 = (state.address_line1 || '').trim();
    _state.address.line2 = (state.address_line2 || '').trim();
    _state.address.postal_code = (state.address_postal_code || '').trim();
    _state.address.state = (state.address_state || '').trim();
    _state.metadata.tax_code = (state.tax_code ? state.tax_code : '').trim();
    _state.metadata.pec = (state.pec && state.isBusiness ? state.pec : '').trim();
    _state.metadata.sdi = (state.sdi && state.isBusiness ? state.sdi : '').trim();
    return _state;
  };

  const getAccountData = (): SCCustomerBillingInfo => {
    const _state: any = {};
    _state.name = (state.name || '').trim();
    _state.phone = (state.phone || '').trim();
    _state.address_city = (state.address_city || '').trim();
    _state.address_country = state.address_country;
    _state.address_line1 = (state.address_line1 || '').trim();
    _state.address_line2 = (state.address_line2 || '').trim();
    _state.address_postal_code = (state.address_postal_code || '').trim();
    _state.address_state = (state.address_state || '').trim();
    _state.tax_code = (state.tax_code || '').trim();
    _state.tax_id_data = state.tax_id_data;
    _state.pec = (state.pec || '').trim();
    _state.sdi = (state.sdi || '').trim();
    return _state;
  };

  const isCustomerCompleted = (displayErrors = true, account: SCCustomerBillingInfo = state): boolean => {
    let _completed = true;
    const _errors: Record<string, string> = {
      nameError: '',
      addressLine1Error: '',
      addressPostalCodeError: '',
      addressCityError: '',
      addressStateError: '',
      addressCountryError: '',
      taxCodeError: '',
      taxIdDataError: '',
      error: ''
    };
    _completed = Boolean(
      account.name &&
        account.address_line1 &&
        account.address_postal_code &&
        account.address_city &&
        account.address_state &&
        account.address_country &&
        account.tax_code
    );
    if (!_completed) {
      if (!account.name) {
        _errors[`nameError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
      if (!account.address_line1) {
        _errors[`addressLine1Error`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
      if (!account.address_postal_code) {
        _errors[`addressPostalCodeError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
      if (!account.address_city) {
        _errors[`addressCityError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
      if (!account.address_state) {
        _errors[`addressStateError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
      if (!account.address_country) {
        _errors[`addressCountryError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
      if (!account.tax_code && !account.isBusiness) {
        _errors[`taxCodeError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
      }
    }
    if (account.isBusiness) {
      if (!account.tax_id_data || !account.tax_id_data.value) {
        _errors[`taxIdDataError`] = intl.formatMessage({
          id: 'component.billingInfo.error',
          defaultMessage: 'component.billingInfo.error'
        });
        _completed = false;
      }
      if (account.address_country?.code === COUNTRY_CODES.IT && !account.sdi && !account.pec) {
        _errors[`sdiError`] = intl.formatMessage({
          id: 'component.billingInfo.sdiPecError',
          defaultMessage: 'component.billingInfo.sdiPecError'
        });
        _errors[`pecError`] = intl.formatMessage({
          id: 'component.billingInfo.sdiPecError',
          defaultMessage: 'component.billingInfo.sdiPecError'
        });
        _completed = false;
      }
      if (account.pec && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.pec)) {
        _errors[`pecError`] = intl.formatMessage({
          id: 'component.billingInfo.pecError',
          defaultMessage: 'component.billingInfo.pecError'
        });
        _completed = false;
      }
    }
    if (!_completed && displayErrors) {
      dispatch({
        type: actionTypes.SET_ERRORS,
        payload: {
          ..._errors,
          ...{
            error: intl.formatMessage({
              id: 'component.billingInfo.errors',
              defaultMessage: 'component.billingInfo.errors'
            })
          }
        }
      });
    } else {
      dispatch({type: actionTypes.RESET_ERRORS});
    }
    return _completed;
  };

  const handleSaveAddress = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await updateCustomerAddress(customer.id, getStripeAccountData());
  };

  const handleSaveTaxId = async () => {
    /* if (!state.isBusiness && state.initialData.isBusiness && state.tax_id_data && state.tax_id_data.id) {
      return deleteCustomerTaxId(state.tax_id_data.id).then((response) => {
        if (!response.error) {
          dispatch({type: actionTypes.SET_DATA, payload: {tax_id_data: null, taxIdVerificationStatus: null}});
        }
        return Promise.resolve(response);
      });
    }
    if (state.isBusiness && state.tax_id_data && state.tax_id_data.value && state.address_country) {
      if (state.tax_id_data && state.tax_id_data.id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return deleteCustomerTaxId(state.tax_id_data.id).then((response) => {
          if (response.error || (response.taxId && !response.taxId.deleted)) {
            return Promise.resolve(response);
          }
          // Reset taxId and verification
          dispatch({type: actionTypes.SET_DATA, payload: {tax_id_data: null, taxIdVerificationStatus: null}});
          return createCustomerTaxId({
            type: state.address_country.taxType,
            value: state.tax_id_data.value
          }).then((res) => {
            if (res) {
              console.log(res);
              dispatch({
                type: actionTypes.SET_DATA,
                payload: {
                  tax_id_data: res.taxId,
                  taxIdVerificationStatus: res.taxId?.verification?.status
                }
              });
              return Promise.resolve(res);
            }
          });
        });
      }

      return createCustomerTaxId({
        type: state.address_country.taxType,
        value: state.tax_id_data.value
      }).then((res) => {
        dispatch({
          type: actionTypes.SET_DATA,
          payload: {tax_id_data: res.taxId, taxIdVerificationStatus: res.taxId?.verification?.status}
        });
        return res;
      });
    } */
    return Promise.resolve(() => ({}));
  };

  const handleChange = (name: string) => {
    return function (event: any, value?: any) {
      let _value = event.target.value;
      if (name === 'address_country') {
        _value = value ?? null;
      }
      if (name === 'tax_id_data') {
        _value = {...state.tax_id_data, ...{value: event.target.value}};
      }
      const newState = {[`${name}`]: _value, [`${camelCase(name)}Error`]: null};
      if (name === 'tax_id_data') {
        newState.taxIdVerificationStatus = null;
      }
      dispatch({type: actionTypes.SET_DATA, payload: newState});
      if (onChange) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const account: CustomerBillingInfo = getAccountData();
        onChange(account);
      }
    };
  };

  const handleSubmit = async () => {
    dispatch({type: actionTypes.RESET_ERRORS});
    if (!state.isProcessing && isCustomerCompleted()) {
      dispatch({type: actionTypes.PROCESSING, payload: {isProcessing: true}});
      const customer: any = await handleSaveAddress();
      if (!customer.error) {
        dispatch({
          type: actionTypes.SET_INITIAL_DATA,
          payload: {initial_data: getAccountData(), initial_data_completed: true}
        });
        const taxId: any = await handleSaveTaxId();
        if (taxId.error) {
          console.log(taxId);
          onError && onError(taxId.error);
          dispatch({
            type: actionTypes.SET_ERRORS,
            payload: {
              taxIdDataError: intl.formatMessage({
                id: 'component.billingInfo.vatError',
                defaultMessage: 'component.billingInfo.vatError'
              })
            }
          });
          enqueueSnackbar(<FormattedMessage id="pwa.common.error" defaultMessage="pwa.common.error" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        } else {
          enqueueSnackbar(<FormattedMessage id="pwa.common.success" defaultMessage="pwa.common.success" />, {
            variant: 'success',
            autoHideDuration: 3000
          });
          if (onSave) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const account: CustomerBillingInfo = getAccountData(state);
            if (mode) {
              dispatch({type: actionTypes.SET_MODE, payload: {mode}});
            }
            onSave(account);
          }
        }
        dispatch({type: actionTypes.PROCESSING, payload: {isProcessing: false}});
      } else {
        console.log(customer.error);
        onError && onError(customer.error);
        enqueueSnackbar(<FormattedMessage id="pwa.common.error" defaultMessage="pwa.common.error" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
        dispatch({type: actionTypes.PROCESSING, payload: {isProcessing: false}});
      }
      dispatch({type: actionTypes.PROCESSING, payload: {isProcessing: false}});
    }
  };

  const handleSetBusiness = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({type: actionTypes.SET_DATA, payload: {isBusiness: event.target.checked}});
  };

  const handleBack = () => {
    dispatch({type: actionTypes.RESET_DATA});
    dispatch({type: actionTypes.RESET_ERRORS});
    handleChangeViewMode();
    onBack && onBack();
  };

  const handleChangeViewMode = () => {
    const _mode = state.mode === UserBillingInfoMode.READ ? UserBillingInfoMode.EDIT : UserBillingInfoMode.READ;
    dispatch({type: actionTypes.SET_MODE, payload: {mode: _mode}});
    onChangeViewMode && onChangeViewMode(_mode);
  };

  useEffect(() => {
    if (state.isLoading) {
      /* getCustomer()
        .then((resCustomer) => {
          getAllCustomerTaxIds().then((resTaxIds) => {
            setCustomer(resCustomer.customer);
            const payload = {
              isLoading: false,
              name: resCustomer.customer.name,
              phone: resCustomer.customer.phone,
              ...(resCustomer.customer.address &&
                resCustomer.customer.address.line1 !== undefined && {
                  address_line1: resCustomer.customer.address.line1
                }),
              ...(resCustomer.customer.address &&
                resCustomer.customer.address.line2 !== undefined && {
                  address_line2: resCustomer.customer.address.line2
                }),
              ...(resCustomer.customer.address &&
                resCustomer.customer.address.postal_code !== undefined && {
                  address_postal_code: resCustomer.customer.address.postal_code
                }),
              ...(resCustomer.customer.address &&
                resCustomer.customer.address.city !== undefined && {address_city: resCustomer.customer.address.city}),
              ...(resCustomer.customer.address &&
                resCustomer.customer.address.state !== undefined && {
                  address_state: resCustomer.customer.address.state
                }),
              ...(resCustomer.customer.address &&
                resCustomer.customer.address.country !== undefined && {
                  address_country: getCountryOption(resCustomer.customer.address.country)
                }),
              ...(resCustomer.customer.metadata.tax_code && {tax_code: resCustomer.customer.metadata.tax_code}),
              ...(resCustomer.customer.metadata.sdi && {sdi: resCustomer.customer.metadata.sdi}),
              ...(resCustomer.customer.metadata.pec && {pec: resCustomer.customer.metadata.pec}),
              isBusiness: false
            };
            if (resTaxIds.taxIds && resTaxIds.taxIds.data.length > 0) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              payload['tax_id_data'] = resTaxIds.taxIds.data[0];
              payload['isBusiness'] = Boolean(resTaxIds.taxIds.data[0].value);
              payload['taxIdVerificationStatus'] = resTaxIds.taxIds.data[0].verification?.status;
            }
            const _completed = isCustomerCompleted(false, payload);
            payload['mode'] = _completed ? mode : UserBillingInfoMode.EDIT;
            dispatch({
              type: actionTypes.SET_INITIAL_DATA,
              payload: {initial_data: payload, initial_data_completed: _completed}
            });
            dispatch({type: actionTypes.SET_DATA, payload});
            onLoad && onLoad(getAccountData(), _completed);
          });
        })
        .catch((e) => {
          enqueueSnackbar(<FormattedMessage id="pwa.common.error" defaultMessage="pwa.common.error" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        }); */
    }
  }, []);

  useEffect(() => {
    dispatch({type: actionTypes.SET_MODE, payload: {mode}});
  }, [mode]);

  useImperativeHandle(ref, () => ({
    isBillingInfoCompleted: () => {
      return isCustomerCompleted();
    },
    showError: (error: string) => {
      dispatch({type: actionTypes.SET_ERRORS, payload: {error}});
    },
    billingMode: () => {
      return state.mode;
    }
  }));

  if (!isPaymentsEnabled || !scUserContext.user) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} id={id} {...rest} ref={componentRef}>
      <Fragment>
        {state.isLoading ? (
          <UserBillingInfoSkeleton mode={mode} />
        ) : (
          <Fragment>
            {state.mode === UserBillingInfoMode.READ ? (
              <>
                {state.name ? (
                  <>
                    <Typography variant={'body1'}>{state.name}</Typography>
                    <Typography variant={'body1'}>
                      {state.address_line1}
                      <br />
                      {state.address_line2}
                    </Typography>
                    <Typography variant={'body1'}>
                      {state.address_postal_code} - {state.address_city} - {state.address_country && state.address_country.label}
                    </Typography>
                    {Boolean(state.tax_code && !state.isBusiness) && <Typography variant={'body1'}>{state.tax_code}</Typography>}
                    {state.isBusiness && (
                      <>
                        {state.tax_id_data && <Typography variant={'body1'}>VAT: {state.tax_id_data.value}</Typography>}
                        {state.sdi && <Typography variant={'body1'}>SDI: {state.sdi}</Typography>}
                        {state.pec && <Typography variant={'body1'}>PEC: {state.pec}</Typography>}
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant={'body1'}>
                    <FormattedMessage id="ui.userBillingInfo.noInfo" defaultMessage="ui.userBillingInfo.noInfo" />
                  </Typography>
                )}
                {state.initialDataCompleted && (
                  <Button sx={{mt: 1}} variant={'contained'} size={'small'} disabled={Boolean(disableButtons)} onClick={handleChangeViewMode}>
                    <FormattedMessage
                      id="component.CheckoutForm.billingInfoChangeButton"
                      defaultMessage="component.CheckoutForm.billingInfoChangeButton"
                    />
                  </Button>
                )}
              </>
            ) : (
              <Box>
                <Grid container width="100%" spacing={3}>
                  {/* Name - name */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="name"
                      name="name"
                      label={<FormattedMessage id="ui.userBillingInfo.name" defaultMessage="ui.userBillingInfo.name" />}
                      onChange={handleChange('name')}
                      value={state.name}
                      error={Boolean(state.nameError)}
                      helperText={state.nameError}
                      fullWidth
                    />
                  </Grid>

                  {/* address_line1 */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="address_line1"
                      name="address_line1"
                      label={<FormattedMessage id="ui.userBillingInfo.address1" defaultMessage="ui.userBillingInfo.address1" />}
                      onChange={handleChange('address_line1')}
                      value={state.address_line1}
                      error={Boolean(state.addressLine1Error)}
                      helperText={state.addressLine1Error}
                      fullWidth
                    />
                  </Grid>

                  {/* address_line2 */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="address_line2"
                      name="address_line2"
                      label={<FormattedMessage id="ui.userBillingInfo.address2" defaultMessage="ui.userBillingInfo.address2" />}
                      onChange={handleChange('address_line2')}
                      value={state.address_line2}
                      error={Boolean(state.addressLine2Error)}
                      helperText={state.addressLine2Error}
                      fullWidth
                    />
                  </Grid>

                  {/* country */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <Autocomplete
                      id="country-select-demo"
                      options={countries}
                      value={state.address_country}
                      fullWidth
                      onChange={handleChange('address_country')}
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => {
                        const {key, ...rest} = props;
                        return (
                          <Box key={key} component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...rest}>
                            <img
                              loading="lazy"
                              width="20"
                              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                              alt=""
                            />
                            {option.label} ({option.code})
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<FormattedMessage id="ui.userBillingInfo.country" defaultMessage="ui.userBillingInfo.country" />}
                          fullWidth
                          id="address_country"
                          name="address_country"
                          error={Boolean(state.addressCountryError)}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              ...(state.address_country && {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <img
                                      loading="lazy"
                                      width="20"
                                      srcSet={`https://flagcdn.com/w40/${state.address_country.code.toLowerCase()}.png 2x`}
                                      src={`https://flagcdn.com/w20/${state.address_country.code.toLowerCase()}.png`}
                                      alt=""
                                    />
                                  </InputAdornment>
                                )
                              })
                            },
                            htmlInput: {
                              ...params.inputProps,
                              autoComplete: 'new-password' // disable autocomplete and autofill
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* address_state */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="address_state"
                      name="address_state"
                      label={<FormattedMessage id="ui.userBillingInfo.state" defaultMessage="ui.userBillingInfo.state" />}
                      onChange={handleChange('address_state')}
                      value={state.address_state}
                      error={Boolean(state.addressStateError)}
                      helperText={state.addressStateError}
                      fullWidth
                    />
                  </Grid>

                  {/* address_postal_code */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="address_postal_code"
                      name="address_postal_code"
                      label={<FormattedMessage id="ui.userBillingInfo.postalCode" defaultMessage="ui.userBillingInfo.postalCode" />}
                      onChange={handleChange('address_postal_code')}
                      value={state.address_postal_code}
                      error={Boolean(state.addressPostalCodeError)}
                      helperText={state.addressPostalCodeError}
                      fullWidth
                    />
                  </Grid>

                  {/* address_city */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="address_city"
                      name="address_city"
                      label={<FormattedMessage id="ui.userBillingInfo.city" defaultMessage="ui.userBillingInfo.city" />}
                      onChange={handleChange('address_city')}
                      value={state.address_city}
                      error={Boolean(state.addressCityError)}
                      helperText={state.addressCityError}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon>public</Icon>
                            </InputAdornment>
                          )
                        }
                      }}
                      fullWidth
                    />
                  </Grid>

                  {/* Phone - phone */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="phone"
                      name="phone"
                      label={<FormattedMessage id="ui.userBillingInfo.phone" defaultMessage="ui.userBillingInfo.phone" />}
                      onChange={handleChange('phone')}
                      value={state.phone}
                      error={Boolean(state.phoneError)}
                      helperText={state.phoneError}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon>person</Icon>
                            </InputAdornment>
                          )
                        }
                      }}
                      fullWidth
                    />
                  </Grid>

                  {/* TaxCode (TIN/CF) */}
                  <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                    <TextField
                      variant="outlined"
                      id="tax_code"
                      name="tax_code"
                      label={<FormattedMessage id="ui.userBillingInfo.taxCode" defaultMessage="ui.userBillingInfo.taxCode" />}
                      onChange={handleChange('tax_code')}
                      value={state.tax_code}
                      error={Boolean(state.taxCodeError)}
                      helperText={state.taxCodeError}
                      fullWidth
                    />
                  </Grid>

                  <Grid size="grow">
                    <FormGroup>
                      <FormControlLabel
                        disabled={Boolean(disableButtons)}
                        control={
                          <Checkbox
                            checked={state.isBusiness}
                            {...((state.taxIdDataError || state.sdiError || state.pecError) && {color: 'secondary'})}
                            className={classNames({
                              [classes.error]: state.taxIdDataError || state.sdiError || state.pecError
                            })}
                            onChange={handleSetBusiness}
                          />
                        }
                        label={
                          <span
                            className={classNames({
                              [classes.error]: state.taxIdDataError || state.sdiError || state.pecError
                            })}>
                            {intl.formatMessage({
                              id: 'component.billingInfo.accountBusiness',
                              defaultMessage: 'component.billingInfo.accountBusiness'
                            })}
                          </span>
                        }
                      />
                    </FormGroup>
                  </Grid>

                  {state.isBusiness && (
                    <Grow in={state.isBusiness}>
                      <Grid size="grow">
                        <Grid container width="100%" spacing={3}>
                          {/* tax_id_data */}
                          <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                            <TextField
                              variant="outlined"
                              id="tax_id_data"
                              name="tax_id_data"
                              label={<FormattedMessage id="ui.userBillingInfo.taxId" defaultMessage="ui.userBillingInfo.taxId" />}
                              onChange={handleChange('tax_id_data')}
                              value={state.tax_id_data ? state.tax_id_data.value : null}
                              error={Boolean(state.taxIdDataError)}
                              helperText={`${state.taxIdDataError ? state.taxIdDataError : ''} ${
                                state.address_country && state.address_country.code && VAT_EXAMPLE[state.address_country.code as string]
                                  ? intl.formatMessage({
                                      id: 'component.billingInfo.requiredFormat',
                                      defaultMessage: 'component.billingInfo.requiredFormat'
                                    }) + VAT_EXAMPLE[state.address_country.code as string]
                                  : ''
                              }`}
                              placeholder={
                                state.address_country && state.address_country.code && VAT_EXAMPLE[state.address_country.code as string]
                                  ? VAT_EXAMPLE[state.address_country.code as string]
                                  : ''
                              }
                              slotProps={{
                                input: {
                                  endAdornment: state.taxIdVerificationStatus !== null && (
                                    <InputAdornment position="end">
                                      {state.taxIdVerificationStatus === 'verified' ? (
                                        <Icon color="primary">done</Icon>
                                      ) : state.taxIdVerificationStatus === 'pending' ? (
                                        <Tooltip
                                          id="tooltip-warning"
                                          title={
                                            <FormattedMessage
                                              id="ui.userBillingInfo.taxCheckPending"
                                              defaultMessage="ui.userBillingInfo.taxCheckPending"
                                            />
                                          }
                                          enterDelay={300}
                                          leaveDelay={300}
                                          placement="top">
                                          <Icon color="warning">help</Icon>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip
                                          id="tooltip-warning"
                                          title={
                                            <FormattedMessage
                                              id="ui.userBillingInfo.taxCheckWarning"
                                              defaultMessage="ui.userBillingInfo.taxCheckWarning"
                                            />
                                          }
                                          enterDelay={300}
                                          leaveDelay={300}
                                          placement="top">
                                          <Icon color="warning">help</Icon>
                                        </Tooltip>
                                      )}
                                    </InputAdornment>
                                  )
                                }
                              }}
                              fullWidth
                            />
                          </Grid>

                          {/* SDI */}
                          <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                            <TextField
                              variant="outlined"
                              id="sdi"
                              name="sdi"
                              label={`${intl.formatMessage({id: 'component.billingInfo.sdi', defaultMessage: 'component.billingInfo.sdi'})} ${
                                state.address_country?.code === COUNTRY_CODES.IT
                                  ? intl.formatMessage({
                                      id: 'component.billingInfo.field.optional',
                                      defaultMessage: 'component.billingInfo.field.optional'
                                    })
                                  : ''
                              }`}
                              onChange={handleChange('sdi')}
                              value={state.sdi}
                              error={Boolean(state.sdiError)}
                              helperText={state.sdiError}
                              fullWidth
                            />
                          </Grid>

                          {/* PEC */}
                          <Grid size={{xs: 12, sm: inlineDisplay ? 12 : 6}}>
                            <TextField
                              variant="outlined"
                              id="pec"
                              name="pec"
                              label={`${intl.formatMessage({id: 'component.billingInfo.pec', defaultMessage: 'component.billingInfo.pec'})} ${
                                state.address_country?.code === COUNTRY_CODES.IT
                                  ? intl.formatMessage({
                                      id: 'component.billingInfo.field.optional',
                                      defaultMessage: 'component.billingInfo.field.optional'
                                    })
                                  : ''
                              }`}
                              onChange={handleChange('pec')}
                              value={state.pec}
                              error={Boolean(state.pecError)}
                              helperText={state.pecError}
                              slotProps={{
                                input: {
                                  type: 'email',
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Icon>email</Icon>
                                    </InputAdornment>
                                  )
                                }
                              }}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grow>
                  )}

                  {state.error && (
                    <Grid size="grow">
                      <Typography align="left" color="secondary">
                        {state.error}
                      </Typography>
                    </Grid>
                  )}

                  <Grid size="grow">
                    <Typography align="left">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        disabled={state.isProcessing || Boolean(disableButtons)}
                        loading={state.isProcessing}
                        onClick={handleSubmit}>
                        {buttonLabel}
                      </Button>
                      {onBack && state.initialDataCompleted && (
                        <Button variant="text" size="small" onClick={handleBack} disabled={Boolean(disableButtons)}>
                          <FormattedMessage id="ui.userBillingInfo.back" defaultMessage="ui.userBillingInfo.back" />
                        </Button>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Fragment>
        )}
      </Fragment>
    </Root>
  );
};

export default forwardRef(UserBillingInfo);
