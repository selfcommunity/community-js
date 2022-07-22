import {useEffect, useMemo, useReducer} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCFeedUnitType} from '@selfcommunity/types';
import {EndpointType, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getFeedCacheKey, getStateFeedCacheKey} from '../constants/Cache';
import {appendURLSearchParams} from '@selfcommunity/utils';

/**
 * Interface SCPaginatedFeedType
 */
export interface SCPaginatedFeedType {
  componentLoaded: boolean;
  results: SCFeedUnitType[];
  count: number;
  next: string;
  previous: string;
  isLoadingNext: boolean;
  isLoadingPrevious: boolean;
  currentPage: number;
  currentOffset: number;
  reload: boolean;
}

/**
 * @hidden
 * We have complex state logic that involves multiple sub-values,
 * so useReducer is preferable to useState.
 * Define all possible auth action types label
 * Use this to export actions and dispatch an action
 */
export const feedDataActionTypes = {
  LOADING_NEXT: '_loading_next',
  LOADING_PREVIOUS: '_loading_previous',
  DATA_NEXT_LOADED: '_data_next_loaded',
  DATA_PREVIOUS_LOADED: '_data_previous_loaded',
  DATA_REVALIDATE: '_data_revalidate',
  DATA_RELOAD: '_data_reload',
  DATA_RELOADED: '_data_reloaded',
  UPDATE_DATA: '_data_update',
};

/**
 * feedDataReducer:
 *  - manage the state of feed object
 *  - update the state base on action type
 * @param state
 * @param action
 */
function feedDataReducer(state, action) {
  let _state;
  switch (action.type) {
    case feedDataActionTypes.LOADING_NEXT:
      _state = {...state, isLoadingNext: true, isLoadingPrevious: false};
      break;
    case feedDataActionTypes.LOADING_PREVIOUS:
      _state = {...state, isLoadingNext: false, isLoadingPrevious: true};
      break;
    case feedDataActionTypes.DATA_NEXT_LOADED:
      _state = {
        ...state,
        currentPage: action.payload.currentPage,
        currentOffset: action.payload.currentOffset,
        results: [...state.results, ...action.payload.results],
        isLoadingNext: false,
        componentLoaded: true,
        next: action.payload.next,
        ...(action.payload.previous ? {previous: action.payload.previous} : {}),
        ...(action.payload.count ? {count: action.payload.count} : {}),
      };
      break;
    case feedDataActionTypes.DATA_PREVIOUS_LOADED:
      _state = {
        ...state,
        currentPage: action.payload.currentPage,
        currentOffset: action.payload.currentOffset,
        initialOffset: action.payload.initialOffset,
        results: [...action.payload.results, ...state.results],
        isLoadingPrevious: false,
        componentLoaded: true,
        previous: action.payload.previous,
      };
      break;
    case feedDataActionTypes.DATA_REVALIDATE:
      _state = {
        ...state,
        results: action.payload.results,
      };
      break;
    case feedDataActionTypes.DATA_RELOAD:
      _state = {
        ...state,
        next: action.payload.next,
        currentPage: 1,
        currentOffset: 0,
        initialOffset: 0,
        results: [],
        count: 0,
        previous: null,
        reload: true,
      };
      break;
    case feedDataActionTypes.DATA_RELOADED:
      _state = {
        ...state,
        componentLoaded: false,
        reload: false,
      };
      break;
    case feedDataActionTypes.UPDATE_DATA:
      _state = {
        ...state,
        ...action.payload,
      };
      break;
  }
  LRUCache.set(getStateFeedCacheKey(state.id), _state);
  return _state;
}

/**
 * Define initial state
 * @param data
 */
function stateInitializer(data): SCPaginatedFeedType {
  let _initState = {
    id: data.id,
    results: [],
    count: 0,
    next: data.next,
    previous: null,
    isLoadingNext: false,
    isLoadingPrevious: false,
    limit: data.queryParams.limit,
    currentPage: Math.ceil(data.queryParams.offset / data.queryParams.limit + 1),
    currentOffset: data.queryParams.offset,
    initialOffset: data.queryParams.offset,
    reload: false,
    componentLoaded: Boolean(data.prefetchedData),
    ...(data.prefetchedData && data.prefetchedData),
  };
  const __feedStateCacheKey = getStateFeedCacheKey(data.id);
  if (__feedStateCacheKey && LRUCache.hasKey(__feedStateCacheKey) && data.cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
    const _cachedStateData = LRUCache.get(__feedStateCacheKey);
    return {..._initState, ..._cachedStateData};
  }
  return _initState;
}

/**
 :::info
 This custom hooks is used to fetch paginated Data.
 :::
 * @param endpoint
 * @param offset
 * @param pageSize
 * @param onChangePage
 * @param cacheStrategy
 */
export default function useSCFetchFeed(props: {
  id: string;
  endpoint: EndpointType;
  endpointQueryParams?: Record<string, string | number>;
  onNextPage?: (page, offset, total, data) => any;
  onPreviousPage?: (page, offset, total, data) => any;
  cacheStrategy?: CacheStrategies;
  prefetchedData?: SCPaginatedResponse<SCFeedUnitType>;
}) {
  // PROPS
  const {
    id,
    endpoint,
    endpointQueryParams = {limit: 5, offset: 0},
    onNextPage,
    onPreviousPage,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
    prefetchedData,
  } = props;
  const queryParams = useMemo(() => Object.assign({limit: 10, offset: 0}, endpointQueryParams), [endpointQueryParams]);

  /**
   * Get next url
   */
  const getInitialNextUrl = () => {
    const _initialEndpoint = appendURLSearchParams(
      endpoint.url({}),
      Object.keys(queryParams).map((k) => ({[k]: queryParams[k]}))
    );
    return _initialEndpoint;
  };

  // STATE
  const [state, dispatch] = useReducer(feedDataReducer, {}, () =>
    stateInitializer({id, endpoint, queryParams, next: getInitialNextUrl(), cacheStrategy, prefetchedData})
  );

  /**
   * Calculate current page
   */
  const getCurrentOffset = (url) => {
    const urlSearchParams = new URLSearchParams(url);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params.offset ? parseInt(params.offset) : 0;
  };

  /**
   * Feed revalidation
   */
  const revalidate = (url, forward) => {
    return performFetchData(url, false).then((res) => {
      let _data;
      if (forward) {
        let start = state.results.slice(0, state.results.length - res.results.length);
        _data = start.concat(res.results);
      } else {
        let start = state.results.slice(res.results.length, state.results.length);
        _data = res.results.concat(start);
      }
      dispatch({
        type: feedDataActionTypes.DATA_REVALIDATE,
        payload: {results: _data},
      });
    });
  };

  /**
   * Get Feed data
   */
  const performFetchData = (url, seekCache = true) => {
    const __feedDataCacheKey = getFeedCacheKey(id, state.next);
    if (seekCache && LRUCache.hasKey(__feedDataCacheKey) && cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
      return Promise.resolve(LRUCache.get(__feedDataCacheKey));
    }
    return http
      .request({
        url,
        method: endpoint.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        LRUCache.set(__feedDataCacheKey, res.data);
        return Promise.resolve(res.data);
      });
  };

  /**
   * Fetch previous data
   */
  function getPreviousPage() {
    if (endpoint && state.previous && !state.isLoadingPrevious) {
      dispatch({type: feedDataActionTypes.LOADING_PREVIOUS});
      performFetchData(state.previous)
        .then((res) => {
          let currentOffset = Math.max(getCurrentOffset(state.previous), 0);
          let currentPage = Math.ceil(currentOffset / queryParams.limit + 1);
          dispatch({
            type: feedDataActionTypes.DATA_PREVIOUS_LOADED,
            payload: {
              currentPage,
              currentOffset,
              initialOffset: currentOffset,
              count: res.count,
              results: res.results,
              previous: res.previous,
            },
          });
          onPreviousPage && onPreviousPage(currentPage, currentOffset, res.count, res.results);
          if (cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE) {
            revalidate(state.next, false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        });
    }
  }

  /**
   * Fetch next data
   */
  function getNextPage() {
    if (endpoint && state.next && !state.isLoadingNext) {
      dispatch({type: feedDataActionTypes.LOADING_NEXT});
      performFetchData(state.next)
        .then((res) => {
          let currentOffset = Math.max(getCurrentOffset(res.next) - queryParams.limit, 0);
          let currentPage = Math.ceil(currentOffset / queryParams.limit + 1);
          dispatch({
            type: feedDataActionTypes.DATA_NEXT_LOADED,
            payload: {
              currentPage,
              currentOffset,
              results: res.results,
              next: res.next,
              count: res.count,
              componentLoaded: true,
              ...(queryParams.offset && state.results.length === 0 ? {previous: res.previous} : {}),
            },
          });
          onNextPage && onNextPage(currentPage, currentOffset, res.count, res.results);
          if (cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE) {
            revalidate(state.next, true);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        });
    }
  }

  /**
   * Reload
   */
  function reload() {
    dispatch({
      type: feedDataActionTypes.DATA_RELOAD,
      payload: {
        next: getInitialNextUrl(),
      },
    });
  }

  /**
   * Reload fetch data
   */
  useEffect(() => {
    if (state.componentLoaded && state.reload && !state.isLoadingNext && !state.isLoadingPrevious) {
      dispatch({
        type: feedDataActionTypes.DATA_RELOADED,
      });
      getNextPage();
    }
  }, [state.reload]);

  /**
   * Update component state
   * Re-sync next/previous url
   * When an element is added in the head of a rendered list, fix the next/previous url
   * to avoid importing posts already in the list
   * @param payload
   */
  function updateState(payload) {
    dispatch({type: feedDataActionTypes.UPDATE_DATA, payload: payload});
  }

  return {
    ...state,
    updateState,
    getNextPage,
    getPreviousPage,
    reload,
  };
}
