import {useEffect, useReducer} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserType, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import useSCFetchFeedObject from './useSCFetchFeedObject';
import {getContributorsCacheKey} from '../constants/Cache';
import {useIsComponentMountedRef} from '@selfcommunity/react-core';

/**
 * Interface SCCommentsObjectType
 */
export interface SCPaginatedContributorsType {
  componentLoaded: boolean;
  contributors: SCUserType[];
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
export const contributorsObjectActionTypes = {
  LOADING_NEXT: '_loading_next',
  LOADING_PREVIOUS: '_loading_previous',
  DATA_NEXT_LOADED: '_data_next_loaded',
  DATA_PREVIOUS_LOADED: '_data_previous_loaded',
  DATA_RELOAD: '_data_reload',
  DATA_RELOADED: '_data_reloaded',
};

/**
 * contributorsReducer:
 *  - manage the state of contributors object
 *  - update the state base on action type
 * @param state
 * @param action
 */
function contributorsReducer(state, action) {
  switch (action.type) {
    case contributorsObjectActionTypes.LOADING_NEXT:
      return {...state, isLoadingNext: true, isLoadingPrevious: false};
    case contributorsObjectActionTypes.LOADING_PREVIOUS:
      return {...state, isLoadingNext: false, isLoadingPrevious: true};
    case contributorsObjectActionTypes.DATA_NEXT_LOADED:
      return {
        ...state,
        page: action.payload.currentPage,
        contributors: action.payload.contributors,
        isLoadingNext: false,
        componentLoaded: true,
        next: action.payload.next,
        ...(action.payload.previous ? {previous: action.payload.previous} : {}),
        ...(action.payload.total ? {total: action.payload.total} : {}),
      };
    case contributorsObjectActionTypes.DATA_PREVIOUS_LOADED:
      return {
        ...state,
        page: action.payload.currentPage,
        contributors: action.payload.contributors,
        isLoadingPrevious: false,
        previous: action.payload.previous,
      };
    case contributorsObjectActionTypes.DATA_RELOAD:
      return {
        ...state,
        next: action.payload.next,
        contributors: [],
        total: 0,
        previous: null,
        reload: true,
      };
    case contributorsObjectActionTypes.DATA_RELOADED:
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
function stateInitializer(data): SCPaginatedContributorsType {
  const __contributorsObjectCacheKey = data.obj ? getContributorsCacheKey(data.obj.id, data.obj.type, data.next) : null;
  let _initState = {
    componentLoaded: false,
    contributors: [],
    total: 0,
    next: data.next,
    previous: null,
    isLoadingNext: false,
    isLoadingPrevious: false,
    page: data.offset / data.pageSize + 1,
    reload: false,
  };
  if (__contributorsObjectCacheKey && LRUCache.hasKey(__contributorsObjectCacheKey) && data.cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
    const _cachedData = LRUCache.get(__contributorsObjectCacheKey);
    return {..._initState, ...{total: _cachedData.count, next: _cachedData.next, previous: _cachedData.previous, contributors: _cachedData.results}};
  }
  return _initState;
}

/**
 :::info
 This custom hooks is used to fetch paginated contributors.
 :::
 * @param id
 * @param feedObject
 * @param feedObjectType
 * @param offset
 * @param pageSize
 */
export default function useSCFetchContributors(props: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType: SCFeedObjectTypologyType;
  offset?: number;
  pageSize?: number;
  onChangePage?: (page) => any;
  cacheStrategy?: CacheStrategies;
}) {
  // PROPS
  const {id, feedObject, feedObjectType, offset = 0, pageSize = 5, onChangePage, cacheStrategy = CacheStrategies.CACHE_FIRST} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // FeedObject
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const objId = obj ? obj.id : null;

  /**
   * Get next url
   */
  const getNextUrl = () => {
    const _offset = offset ? `&offset=${offset}` : '';
    const _objectId = obj ? obj.id : id;
    const _typeObject = obj ? obj.type : feedObjectType;
    return `${Endpoints.FeedObjectContributorsList.url({type: _typeObject, id: _objectId})}?limit=${pageSize}${_offset}`;
  };

  // STATE
  const [state, dispatch] = useReducer(contributorsReducer, {}, () => stateInitializer({obj, offset, pageSize, next: getNextUrl(), cacheStrategy}));

  /**
   * Calculate current page
   */
  const getCurrentPage = (url) => {
    const urlSearchParams = new URLSearchParams(url);
    const params = Object.fromEntries(urlSearchParams.entries());
    const currentOffset: number = params.offset ? parseInt(params.offset) : 0;
    return currentOffset / pageSize + 1;
  };

  /**
   * Get Comments (with cache)
   */
  const revalidate = (url, forward) => {
    return performFetchComments(url, false).then((res) => {
      let _contributors;
      let currentPage = getCurrentPage(state.next);
      if (forward) {
        let start = state.contributors.slice(0, state.contributors.length - res.results.length);
        _contributors = start.concat(res.results);
      } else {
        let start = state.contributors.slice(res.results.length, state.contributors.length);
        _contributors = res.results.concat(start);
      }
      if (isMountedRef.current) {
        dispatch({
          type: forward ? contributorsObjectActionTypes.DATA_NEXT_LOADED : contributorsObjectActionTypes.DATA_PREVIOUS_LOADED,
          payload: {
            page: currentPage,
            contributors: _contributors,
            ...(forward ? {next: res.next} : {previous: res.previous}),
            total: res.count,
          },
        });
      }
    });
  };

  /**
   * Get Comments
   */
  const performFetchComments = (url, seekCache = true) => {
    const _contributorsCacheKey = getContributorsCacheKey(obj.id, obj.type, url);
    if (seekCache && LRUCache.hasKey(_contributorsCacheKey) && cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
      return Promise.resolve(LRUCache.get(_contributorsCacheKey));
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
        LRUCache.set(_contributorsCacheKey, res.data);
        return Promise.resolve(res.data);
      });
  };

  /**
   * Fetch previous contributors
   */
  function getPreviousPage() {
    if (obj && state.previous && !state.isLoadingPrevious) {
      dispatch({type: contributorsObjectActionTypes.LOADING_PREVIOUS});
      performFetchComments(state.previous)
        .then((res) => {
          if (isMountedRef.current) {
            let currentPage = getCurrentPage(state.previous);
            dispatch({
              type: contributorsObjectActionTypes.DATA_PREVIOUS_LOADED,
              payload: {
                page: currentPage,
                contributors: [...res.results, ...state.contributors],
                previous: res.previous,
              },
            });
            onChangePage && onChangePage(currentPage);
          }
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
   * Fetch next contributors
   */
  function getNextPage() {
    if (obj && state.next && !state.isLoadingNext) {
      dispatch({type: contributorsObjectActionTypes.LOADING_NEXT});
      performFetchComments(state.next)
        .then((res) => {
          if (isMountedRef.current) {
            let currentPage = getCurrentPage(state.next);
            dispatch({
              type: contributorsObjectActionTypes.DATA_NEXT_LOADED,
              payload: {
                page: currentPage,
                contributors: [...state.contributors, ...res.results],
                next: res.next,
                total: res.count,
                componentLoaded: true,
                ...(offset && state.contributors.length === 0 ? {previous: res.previous} : {}),
              },
            });
            onChangePage && onChangePage(currentPage);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        })
        .then(() => {
          if (isMountedRef.current && cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE) {
            revalidate(state.next, true);
          }
        });
    }
  }

  /**
   * Reset contributors status on change pageSize, offset
   */
  useEffect(() => {
    if (isMountedRef.current && state.componentLoaded && Boolean(obj) && !state.reload) {
      dispatch({
        type: contributorsObjectActionTypes.DATA_RELOAD,
        payload: {
          next: getNextUrl(),
        },
      });
    }
  }, [objId, pageSize, offset, isMountedRef]);

  /**
   * Reload fetch contributors
   */
  useEffect(() => {
    if (isMountedRef.current && state.componentLoaded && state.reload && !state.isLoadingNext && !state.isLoadingPrevious) {
      dispatch({
        type: contributorsObjectActionTypes.DATA_RELOADED,
      });
      getNextPage();
    }
  }, [state.reload, isMountedRef]);

  return {
    feedObject: obj,
    setFeedObject: setObj,
    ...state,
    pageSize,
    getNextPage,
    getPreviousPage,
  };
}
