import {useEffect, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCommentsOrderBy, SCCommentType} from '../types/comment';
import http from '../utils/http';
import {Logger} from '../utils/logger';
import Endpoints from '../constants/Endpoints';
import {SCFeedObjectType, SCFeedObjectTypologyType} from '../types';
import useSCFetchFeedObject from './useSCFetchFeedObject';

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
}) {
  // PROPS
  const {id, feedObject, feedObjectType, offset = 0, pageSize = 5, orderBy = SCCommentsOrderBy.ADDED_AT_DESC, parent, onChangePage} = props;

  // FeedObject
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const objId = obj ? obj.id : null;

  // Comments
  const [comments, setComments] = useState<SCCommentType[]>([]);

  // Current page
  const [page, setPage] = useState<number>(offset / pageSize + 1);

  // Component status - if load initial data
  const componentLoaded = useRef(false);

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
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [next, setNext] = useState<string>(getNextUrl());
  const [previous, setPrevious] = useState<string>(null);
  const [reload, setReload] = useState<boolean>(false);

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
   * Get Comments
   */
  const performFetchComments = (url) => {
    return http
      .request({
        url,
        method: Endpoints.Comments.method,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      });
  };

  /**
   * Fetch previous comments
   */
  function getPreviousPage() {
    if (obj && previous && !isLoadingPrevious) {
      setIsLoadingPrevious(true);
      performFetchComments(previous)
        .then((res) => {
          let currentPage = getCurrentPage(previous);
          setPage(currentPage);
          setComments([...res.results, ...comments]);
          setPrevious(res.previous);
          setIsLoadingPrevious(false);
          onChangePage && onChangePage(currentPage);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        });
    }
  }

  /**
   * Fetch next comments
   */
  function getNextPage() {
    if (obj && next && !isLoadingNext) {
      setIsLoadingNext(true);
      performFetchComments(next)
        .then((res) => {
          let currentPage = getCurrentPage(next);
          setComments([...comments, ...res.results]);
          setPage(currentPage);
          setNext(res.next);
          setTotal(res.count);
          if (offset && comments.length === 0) {
            // Set initial previous if start from a offset > 0
            setPrevious(res.previous);
          }
          setIsLoadingNext(false);
          componentLoaded.current = true;
          onChangePage && onChangePage(currentPage);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        });
    }
  }

  /**
   * Reset component status on change orderBy, pageSize, offset
   */
  useEffect(() => {
    if (componentLoaded.current && Boolean(obj) && !reload) {
      setNext(getNextUrl());
      setComments([]);
      setTotal(0);
      setPrevious(null);
      setReload(true);
    }
  }, [objId, parent, orderBy, pageSize, offset]);

  /**
   * Reload fetch comments
   */
  useEffect(() => {
    if (componentLoaded.current && reload && !isLoadingNext && !isLoadingPrevious) {
      componentLoaded.current = false;
      setReload(false);
      getNextPage();
    }
  }, [reload]);

  return {
    feedObject: obj,
    setFeedObject: setObj,
    comments,
    setComments,
    isLoadingNext,
    isLoadingPrevious,
    next,
    previous,
    total,
    page,
    pageSize,
    getNextPage,
    getPreviousPage,
    orderBy,
    componentLoaded: componentLoaded.current,
  };
}
