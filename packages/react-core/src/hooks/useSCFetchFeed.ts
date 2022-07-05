import {useEffect, useMemo, useReducer} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCFeedUnitType} from '@selfcommunity/types';
import {Endpoints, EndpointType, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getFeedCacheKey} from '../constants/Cache';
import {appendURLSearchParams} from '@selfcommunity/utils';

/**
 * Interface SCPaginatedFeedType
 */
export interface SCPaginatedFeedType {
  componentLoaded: boolean;
  feedData: SCFeedUnitType[];
  total: number;
  next: string;
  previous: string;
  isLoadingNext: boolean;
  isLoadingPrevious: boolean;
  page: number;
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
  DATA_RELOAD: '_data_reload',
  DATA_RELOADED: '_data_reloaded',
};

/**
 * feedDataReducer:
 *  - manage the state of feedData object
 *  - update the state base on action type
 * @param state
 * @param action
 */
function feedDataReducer(state, action) {
  switch (action.type) {
    case feedDataActionTypes.LOADING_NEXT:
      return {...state, isLoadingNext: true, isLoadingPrevious: false};
    case feedDataActionTypes.LOADING_PREVIOUS:
      return {...state, isLoadingNext: false, isLoadingPrevious: true};
    case feedDataActionTypes.DATA_NEXT_LOADED:
      return {
        ...state,
        page: action.payload.currentPage,
        feedData: action.payload.feedData,
        isLoadingNext: false,
        componentLoaded: true,
        next: action.payload.next,
        ...(action.payload.previous ? {previous: action.payload.previous} : {}),
        ...(action.payload.total ? {total: action.payload.total} : {}),
      };
    case feedDataActionTypes.DATA_PREVIOUS_LOADED:
      return {
        ...state,
        page: action.payload.currentPage,
        feedData: action.payload.feedData,
        isLoadingPrevious: false,
        previous: action.payload.previous,
      };
    case feedDataActionTypes.DATA_RELOAD:
      return {
        ...state,
        next: action.payload.next,
        feedData: [],
        total: 0,
        previous: null,
        reload: true,
      };
    case feedDataActionTypes.DATA_RELOADED:
      return {
        ...state,
        componentLoaded: false,
        reload: false,
      };
    default:
      throw new Error(`Unhandled type: ${action.type}`);
  }
}

/**
 * Define initial state
 * @param data
 */
function stateInitializer(data): SCPaginatedFeedType {
  const __feedDataCacheKey = getFeedCacheKey(data.id, data.next);
  let _initState = {
    componentLoaded: false,
    feedData: [],
    total: 0,
    next: data.next,
    previous: null,
    isLoadingNext: false,
    isLoadingPrevious: false,
    page: data.queryParams.offset / data.queryParams.limit + 1,
    reload: false,
  };
  if (__feedDataCacheKey && LRUCache.hasKey(__feedDataCacheKey) && data.cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
    const _cachedData = LRUCache.get(__feedDataCacheKey);
    return {
      ..._initState,
      ...{componentLoaded: true, total: _cachedData.count, next: _cachedData.next, previous: _cachedData.previous, feedData: _cachedData.results},
    };
  }
  return _initState;
}

/**
 :::info
 This custom hooks is used to fetch paginated feedData.
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
  onChangePage?: (page) => any;
  cacheStrategy?: CacheStrategies;
}) {
  // PROPS
  const {id, endpoint, endpointQueryParams = {limit: 10, offset: 0}, onChangePage, cacheStrategy = CacheStrategies.CACHE_FIRST} = props;
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
    stateInitializer({id, endpoint, queryParams, next: getInitialNextUrl(), cacheStrategy})
  );

  /**
   * Calculate current page
   */
  const getCurrentPage = (url) => {
    const urlSearchParams = new URLSearchParams(url);
    const params = Object.fromEntries(urlSearchParams.entries());
    const currentOffset: number = params.offset ? parseInt(params.offset) : 0;
    return currentOffset / queryParams.limit + 1;
  };

  /**
   * Get Comments (with cache)
   */
  const revalidate = (url, forward) => {
    return performFetchComments(url, false).then((res) => {
      let _feedData;
      let currentPage = getCurrentPage(state.next);
      if (forward) {
        let start = state.feedData.slice(0, state.feedData.length - res.results.length);
        _feedData = start.concat(res.results);
      } else {
        let start = state.feedData.slice(res.results.length, state.feedData.length);
        _feedData = res.results.concat(start);
      }
      dispatch({
        type: forward ? feedDataActionTypes.DATA_NEXT_LOADED : feedDataActionTypes.DATA_PREVIOUS_LOADED,
        payload: {
          page: currentPage,
          feedData: _feedData,
          ...(forward ? {next: res.next} : {previous: res.previous}),
          total: res.count,
        },
      });
    });
  };

  /**
   * Get Comments
   */
  const performFetchComments = (url, seekCache = true) => {
    const __feedDataCacheKey = getFeedCacheKey(id, state.next);
    if (seekCache && LRUCache.hasKey(__feedDataCacheKey) && cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
      return Promise.resolve(LRUCache.get(__feedDataCacheKey));
    }
    return http
      .request({
        url,
        method: Endpoints.Comments.method,
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
   * Fetch previous feedData
   */
  function getPreviousPage() {
    if (endpoint && state.previous && !state.isLoadingPrevious) {
      dispatch({type: feedDataActionTypes.LOADING_PREVIOUS});
      performFetchComments(state.previous)
        .then((res) => {
          let currentPage = getCurrentPage(state.previous);
          dispatch({
            type: feedDataActionTypes.DATA_PREVIOUS_LOADED,
            payload: {
              page: currentPage,
              feedData: [...res.results, ...state.feedData],
              previous: res.previous,
            },
          });
          onChangePage && onChangePage(currentPage);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        })
        .then(() => {
          if (cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE) {
            revalidate(state.next, false);
          }
        });
    }
  }

  /**
   * Fetch next feedData
   */
  function getNextPage() {
    if (endpoint && state.next && !state.isLoadingNext) {
      dispatch({type: feedDataActionTypes.LOADING_NEXT});
      performFetchComments(state.next)
        .then((res) => {
          let currentPage = getCurrentPage(state.next);
          dispatch({
            type: feedDataActionTypes.DATA_NEXT_LOADED,
            payload: {
              page: currentPage,
              feedData: [...state.feedData, ...res.results],
              next: res.next,
              total: res.count,
              componentLoaded: true,
              ...(queryParams.offset && state.feedData.length === 0 ? {previous: res.previous} : {}),
            },
          });
          onChangePage && onChangePage(currentPage);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        })
        .then(() => {
          if (cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE) {
            revalidate(state.next, true);
          }
        });
    }
  }

  function reload() {
    dispatch({
      type: feedDataActionTypes.DATA_RELOAD,
      payload: {
        next: getInitialNextUrl(),
      },
    });
  }

  /**
   * Reset feedData status on change pageSize, offset
   */
  useEffect(() => {
    if (state.componentLoaded && Boolean(endpoint) && !state.reload) {
      reload();
    }
  }, [endpoint, queryParams.offset, queryParams.limit]);

  /**
   * Reload fetch feedData
   */
  useEffect(() => {
    if (state.componentLoaded && state.reload && !state.isLoadingNext && !state.isLoadingPrevious) {
      dispatch({
        type: feedDataActionTypes.DATA_RELOADED,
      });
      getNextPage();
    }
  }, [state.reload]);

  return {
    ...state,
    queryParams,
    getNextPage,
    getPreviousPage,
    reload,
  };
}
