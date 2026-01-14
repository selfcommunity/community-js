export const actionTypes = {
  LOADING: '_loading',
  SET_MODE: '_set_mode',
  SET_DATA: '_set_data',
  RESET_DATA: '_reset_data',
  SET_ERRORS: '_set_errors',
  SET_INITIAL_DATA: '_set_initial_data',
  RESET_ERRORS: '_reset_errors',
  PROCESSING: '_set_processing'
};

export const initialState = {
  initialData: null,
  initialDataCompleted: false,
  isLoading: true,
  isProcessing: false,
  isBusiness: false,
  mode: null,

  /* BillingCustomer Fields (tax_code, sdi, pec are customs) */
  name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  address_postal_code: '',
  address_city: '',
  address_state: '',
  address_country: null,
  tax_code: '',
  tax_id_data: null,
  sdi: '',
  pec: '',

  /* BillingCustomer Errors */
  error: null,
  nameError: null,
  addressLine1Error: null,
  addressLine2Error: null,
  addressPostalCodeError: null,
  addressCityError: null,
  addressStateError: null,
  addressCountryError: null,
  taxCodeError: null,
  taxIdDataError: null,
  sdiError: null,
  pecError: null,

  /* Tax info */
  taxIdVerificationStatus: null
};

// @ts-ignore
export function getInitialState(data = {}) {
  return {...initialState, ...data, initialData: data};
}

// @ts-ignore
export function reducer(state, action) {
  let _state = {...state};
  switch (action.type) {
    case actionTypes.LOADING:
      _state = {...state, isLoading: action.payload.isLoading};
      break;
    case actionTypes.SET_MODE:
      _state = {...state, mode: action.payload.mode};
      break;
    case actionTypes.SET_DATA:
      _state = {
        ...state,
        ...(action.payload.isLoading !== undefined && {isLoading: action.payload.isLoading}),
        ...(action.payload.isProcessing !== undefined && {isProcessing: action.payload.isProcessing}),
        ...(action.payload.isBusiness !== undefined && {isBusiness: action.payload.isBusiness}),
        ...(action.payload.name !== undefined && {name: action.payload.name}),
        ...(action.payload.phone !== undefined && {phone: action.payload.phone}),
        ...(action.payload.address_line1 !== undefined && {address_line1: action.payload.address_line1}),
        ...(action.payload.address_line2 !== undefined && {address_line2: action.payload.address_line2}),
        ...(action.payload.address_postal_code !== undefined && {
          address_postal_code: action.payload.address_postal_code
        }),
        ...(action.payload.address_city !== undefined && {address_city: action.payload.address_city}),
        ...(action.payload.address_state !== undefined && {address_state: action.payload.address_state}),
        ...(action.payload.address_country !== undefined && {address_country: action.payload.address_country}),
        ...(action.payload.tax_code !== undefined && {tax_code: action.payload.tax_code}),
        ...(action.payload.tax_id_data !== undefined && {tax_id_data: action.payload.tax_id_data}),
        ...(action.payload.taxIdVerificationStatus !== undefined && {
          taxIdVerificationStatus: action.payload.taxIdVerificationStatus
        }),
        ...(action.payload.sdi !== undefined && {sdi: action.payload.sdi}),
        ...(action.payload.pec !== undefined && {pec: action.payload.pec}),
        ...(action.payload.mode !== undefined && {mode: action.payload.mode})
      };
      break;
    case actionTypes.SET_INITIAL_DATA:
      _state = {
        ..._state,
        ...{initialData: action.payload.initial_data},
        ...(action.payload.initial_data_completed !== undefined && {
          initialDataCompleted: action.payload.initial_data_completed
        })
      };
      break;
    case actionTypes.RESET_DATA:
      _state = {..._state, ...state.initialData};
      break;
    case actionTypes.SET_ERRORS:
      _state = {
        ...state,
        ...(action.payload.error !== undefined && {error: action.payload.error}),
        ...(action.payload.nameError !== undefined && {nameError: action.payload.nameError}),
        ...(action.payload.phoneError !== undefined && {phoneError: action.payload.phoneError}),
        ...(action.payload.addressLine1Error !== undefined && {addressLine1Error: action.payload.addressLine1Error}),
        ...(action.payload.addressLine2Error !== undefined && {addressLine2Error: action.payload.addressLine2Error}),
        ...(action.payload.addressPostalCodeError !== undefined && {
          addressPostalCodeError: action.payload.addressPostalCodeError
        }),
        ...(action.payload.addressCityError !== undefined && {addressCityError: action.payload.addressCityError}),
        ...(action.payload.addressStateError !== undefined && {addressStateError: action.payload.addressStateError}),
        ...(action.payload.addressCountryError !== undefined && {
          addressCountryError: action.payload.addressCountryError
        }),
        ...(action.payload.taxCodeError !== undefined && {taxCodeError: action.payload.taxCodeError}),
        ...(action.payload.taxIdDataError !== undefined && {taxIdDataError: action.payload.taxIdDataError}),
        ...(action.payload.sdiError !== undefined && {sdiError: action.payload.sdiError}),
        ...(action.payload.pecError !== undefined && {pecError: action.payload.pecError})
      };
      break;
    case actionTypes.RESET_ERRORS:
      _state = {
        ...state,
        error: null,
        nameError: null,
        addressLine1Error: null,
        addressLine2Error: null,
        addressPostalCodeError: null,
        addressCityError: null,
        addressStateError: null,
        addressCountryError: null,
        taxCodeError: null,
        taxIdDataError: null,
        sdiError: null,
        pecError: null
      };
      break;
    case actionTypes.PROCESSING:
      _state = {...state, isProcessing: action.payload.isProcessing};
      break;
  }
  return _state;
}
