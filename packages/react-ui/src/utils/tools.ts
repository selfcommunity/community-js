import {SCCache} from '@selfcommunity/react-core';
import {CacheStrategies, LRUCache} from '@selfcommunity/utils';

/**
 * @hidden
 * We have complex state logic that involves multiple sub-values,
 * so useReducer is preferable to useState.
 * Define all possible auth action types label
 * Use this to export actions and dispatch an action
 */
export const actionToolsTypes = {
  LOADING_NEXT: '_loading_next',
  LOADING_PREVIOUS: '_loading_previous',
  LOAD_NEXT_SUCCESS: '_load_next_success',
  LOAD_PREVIOUS_SUCCESS: '_load_previous_success',
  LOAD_NEXT_FAILURE: '_load_next_failure',
  LOAD_PREVIOUS_FAILURE: '_load_previous_failure',
  SET_RESULTS: '_set_results',
  SET_VISIBLE_ITEMS: '_set_visible_items'
};

/**
 * Manage tools state reducer
 * @param state
 * @param action
 */
export function dataToolsReducer(state, action) {
  let _state = {...state};
  switch (action.type) {
    case actionToolsTypes.LOADING_NEXT:
      _state = {...state, isLoadingNext: true, errorLoadNext: null};
      break;
    case actionToolsTypes.LOADING_PREVIOUS:
      _state = {...state, isLoadingPrevious: true, errorLoadPrevious: null};
      break;
    case actionToolsTypes.LOAD_NEXT_SUCCESS:
      _state = {
        ...state,
        isLoadingNext: false,
        count: action.payload.count,
        next: action.payload.next ? action.payload.next : null,
        results: [...state.results, ...action.payload.results],
        errorLoadNext: null,
        initialized: action.payload?.initialized || true
      };
      break;
    case actionToolsTypes.LOAD_PREVIOUS_SUCCESS:
      _state = {
        ...state,
        isLoadingPrevious: false,
        count: action.payload.count,
        previous: action.payload.previous ? action.payload.previous : null,
        results: [...action.payload.results, ...state.results],
        errorPreviousNext: null
      };
      break;
    case actionToolsTypes.SET_RESULTS:
      _state = {
        ...state,
        results: [...action.payload.results],
        ...(action.payload.count ? {count: action.payload.count} : {})
      };
      break;
    case actionToolsTypes.SET_VISIBLE_ITEMS:
      _state = {...state, visibleItems: action.payload.visibleItems};
      break;
    case actionToolsTypes.LOAD_NEXT_FAILURE:
      _state = {...state, isLoadingNext: false, errorLoadNext: action.payload.error};
      break;
    case actionToolsTypes.LOAD_PREVIOUS_FAILURE:
      _state = {...state, isLoadingNext: false, errorLoadPrevious: action.payload.error};
      break;
  }
  LRUCache.set(_state.cacheKey, _state);
  return _state;
}

/**
 * Define initial tools state
 * @param data
 */
export function stateToolsInitializer(data) {
  let _initState = {
    cacheKey: data.cacheKey ? data.cacheKey : null,
    count: data.count ? data.count : 0,
    results: data.results ? data.results : [],
    next: data.next ? data.next : null,
    previous: data.previous ? data.previous : null,
    isLoadingNext: data.isLoadingNext ? data.isLoadingNext : false,
    isLoadingPrevious: data.isLoadingPrevious ? data.isLoadingPrevious : false,
    visibleItems: data.visibleItems ? data.visibleItems : null,
    initialized: false
  };
  if (_initState.cacheKey && LRUCache.hasKey(_initState.cacheKey) && data.cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
    const _cachedStateData = LRUCache.get(_initState.cacheKey);
    return {..._initState, ..._cachedStateData};
  }
  return _initState;
}
