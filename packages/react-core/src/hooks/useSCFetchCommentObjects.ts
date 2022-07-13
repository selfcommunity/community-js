import {useEffect, useReducer} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCommentsOrderBy, SCCommentType, SCFeedObjectType, SCFeedObjectTypologyType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import useSCFetchFeedObject from './useSCFetchFeedObject';
import {getCommentObjectCacheKey, getCommentObjectsCacheKey} from '../constants/Cache';

/**
 * Interface SCCommentsObjectType
 */
export interface SCCommentsObjectType {
  componentLoaded: boolean;
  comments: SCCommentType[];
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
export const commentsObjectActionTypes = {
  LOADING_NEXT: '_loading_next',
  LOADING_PREVIOUS: '_loading_previous',
  DATA_NEXT_LOADED: '_data_next_loaded',
  DATA_PREVIOUS_LOADED: '_data_previous_loaded',
  DATA_RELOAD: '_data_reload',
  DATA_RELOADED: '_data_reloaded',
};

/**
 * commentsReducer:
 *  - manage the state of comments object
 *  - update the state base on action type
 * @param state
 * @param action
 */
function commentsReducer(state, action) {
  switch (action.type) {
    case commentsObjectActionTypes.LOADING_NEXT:
      return {...state, isLoadingNext: true, isLoadingPrevious: false};
    case commentsObjectActionTypes.LOADING_PREVIOUS:
      return {...state, isLoadingNext: false, isLoadingPrevious: true};
    case commentsObjectActionTypes.DATA_NEXT_LOADED:
      return {
        ...state,
        page: action.payload.currentPage,
        comments: action.payload.comments,
        isLoadingNext: false,
        componentLoaded: true,
        next: action.payload.next,
        ...(action.payload.previous ? {previous: action.payload.previous} : {}),
        ...(action.payload.total ? {total: action.payload.total} : {}),
      };
    case commentsObjectActionTypes.DATA_PREVIOUS_LOADED:
      return {
        ...state,
        page: action.payload.currentPage,
        comments: action.payload.comments,
        isLoadingPrevious: false,
        previous: action.payload.previous,
      };
    case commentsObjectActionTypes.DATA_RELOAD:
      return {
        ...state,
        next: action.payload.next,
        comments: [],
        total: 0,
        previous: null,
        reload: true,
      };
    case commentsObjectActionTypes.DATA_RELOADED:
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
function stateInitializer(data): SCCommentsObjectType {
  const __commentsObjectCacheKey = data.obj ? getCommentObjectsCacheKey(data.obj.id, data.obj.type, data.next) : null;
  let _initState = {
    componentLoaded: false,
    comments: [],
    total: 0,
    next: data.next,
    previous: null,
    isLoadingNext: false,
    isLoadingPrevious: false,
    page: data.offset / data.pageSize + 1,
    reload: false,
  };
  if (__commentsObjectCacheKey && LRUCache.hasKey(__commentsObjectCacheKey) && data.cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
    const _cachedData = LRUCache.get(__commentsObjectCacheKey);
    return {..._initState, ...{total: _cachedData.count, next: _cachedData.next, previous: _cachedData.previous, comments: _cachedData.results}};
  }
  return _initState;
}

/**
 :::info
 This custom hooks is used to fetch paginated comments.
 :::
 * @param id
 * @param feedObject
 * @param feedObjectType
 * @param offset
 * @param pageSize
 * @param orderBy
 * @param parent
 */
export default function useSCFetchCommentObjects(props: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType: SCFeedObjectTypologyType;
  offset?: number;
  pageSize?: number;
  orderBy?: SCCommentsOrderBy;
  parent?: number;
  onChangePage?: (page) => any;
  cacheStrategy?: CacheStrategies;
}) {
  // PROPS
  const {
    id,
    feedObject,
    feedObjectType,
    offset = 0,
    pageSize = 5,
    orderBy = SCCommentsOrderBy.ADDED_AT_DESC,
    parent,
    onChangePage,
    cacheStrategy = CacheStrategies.NETWORK_ONLY,
  } = props;

  // FeedObject
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const objId = obj ? obj.id : null;

  /**
   * Get next url
   */
  const getNextUrl = () => {
    const _offset = offset ? `&offset=${offset}` : '';
    const _parent = parent ? `&parent=${parent}` : '';
    const _objectId = obj ? obj.id : id;
    const _typeObject = obj ? obj.type : feedObjectType;
    return `${Endpoints.Comments.url()}?${_typeObject}=${_objectId}&limit=${pageSize}&ordering=${orderBy}${_offset}${_parent}`;
  };

  // STATE
  const [state, dispatch] = useReducer(commentsReducer, {}, () => stateInitializer({obj, offset, pageSize, next: getNextUrl(), cacheStrategy}));

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
      let _comments;
      let currentPage = getCurrentPage(state.next);
      if (forward) {
        let start = state.comments.slice(0, state.comments.length - res.results.length);
        _comments = start.concat(res.results);
      } else {
        let start = state.comments.slice(res.results.length, state.comments.length);
        _comments = res.results.concat(start);
      }
      dispatch({
        type: forward ? commentsObjectActionTypes.DATA_NEXT_LOADED : commentsObjectActionTypes.DATA_PREVIOUS_LOADED,
        payload: {
          page: currentPage,
          comments: _comments,
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
    const __commentObjectsCacheKey = getCommentObjectsCacheKey(obj.id, obj.type, url);
    if (seekCache && LRUCache.hasKey(__commentObjectsCacheKey) && cacheStrategy !== CacheStrategies.NETWORK_ONLY) {
      return Promise.resolve(LRUCache.get(__commentObjectsCacheKey));
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
        LRUCache.set(__commentObjectsCacheKey, res.data);
        res.data.results.forEach((e) => LRUCache.set(getCommentObjectCacheKey(e.id), e));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Fetch previous comments
   */
  function getPreviousPage() {
    if (obj && state.previous && !state.isLoadingPrevious) {
      dispatch({type: commentsObjectActionTypes.LOADING_PREVIOUS});
      performFetchComments(state.previous)
        .then((res) => {
          let currentPage = getCurrentPage(state.previous);
          dispatch({
            type: commentsObjectActionTypes.DATA_PREVIOUS_LOADED,
            payload: {
              page: currentPage,
              comments: [...res.results, ...state.comments],
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
   * Fetch next comments
   */
  function getNextPage() {
    if (obj && state.next && !state.isLoadingNext) {
      dispatch({type: commentsObjectActionTypes.LOADING_NEXT});
      performFetchComments(state.next)
        .then((res) => {
          let currentPage = getCurrentPage(state.next);
          dispatch({
            type: commentsObjectActionTypes.DATA_NEXT_LOADED,
            payload: {
              page: currentPage,
              comments: [...state.comments, ...res.results],
              next: res.next,
              total: res.count,
              componentLoaded: true,
              ...(offset && state.comments.length === 0 ? {previous: res.previous} : {}),
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

  /**
   * Reset component status on change orderBy, pageSize, offset
   */
  useEffect(() => {
    if (state.componentLoaded && Boolean(obj) && !state.reload) {
      dispatch({
        type: commentsObjectActionTypes.DATA_RELOAD,
        payload: {
          next: getNextUrl(),
        },
      });
    }
  }, [objId, parent, orderBy, pageSize, offset]);

  /**
   * Reload fetch comments
   */
  useEffect(() => {
    if (state.componentLoaded && state.reload && !state.isLoadingNext && !state.isLoadingPrevious) {
      dispatch({
        type: commentsObjectActionTypes.DATA_RELOADED,
      });
      getNextPage();
    }
  }, [state.reload]);

  return {
    feedObject: obj,
    setFeedObject: setObj,
    ...state,
    pageSize,
    getNextPage,
    getPreviousPage,
    orderBy,
  };
}
