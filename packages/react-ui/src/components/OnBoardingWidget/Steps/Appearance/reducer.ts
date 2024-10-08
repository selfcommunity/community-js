export const actionTypes = {
  LOADING: '_loading',
  SET_COLORS: '_set_colors',
  SET_LOGOS: '_set_logos',
  SET_SLOGANS: '_set_slogans'
};

export const initialState = {
  loading: false,
  colors: [],
  logos: [],
  slogans: [],
  modified: false
};

export function getInitialState(data) {
  if (data) {
    return {...initialState, ...data};
  }
  return initialState;
}

export function reducer(state, action) {
  let _state = {...state};
  switch (action.type) {
    case actionTypes.LOADING:
      _state = {...state, loading: action.payload.loading};
      break;
    case actionTypes.SET_COLORS:
      _state = {
        ...state,
        colors: action.payload.colors,
        logos: state.logos,
        ...(action.payload.loading !== undefined && {loading: action.payload.loading}),
        modified: true
      };
      break;
    case actionTypes.SET_LOGOS:
      _state = {
        ...state,
        logos: action.payload.logos,
        colors: state.colors,
        ...(action.payload.loading !== undefined && {loading: action.payload.loading}),
        modified: true
      };
      break;
    case actionTypes.SET_SLOGANS:
      _state = {
        ...state,
        slogans: action.payload.slogans,
        logos: state.logos,
        colors: state.colors,
        ...(action.payload.loading !== undefined && {loading: action.payload.loading}),
        modified: true
      };
      break;
  }
  return _state;
}
