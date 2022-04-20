import {useEffect, useMemo, useRef, useState} from 'react';
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
 * @param page
 * @param pageSize
 * @param orderBy
 * @param parent
 */
export default function useSCFetchCommentObjects({
  id = null,
  feedObject = null,
  feedObjectType = null,
  offset = 0,
  page = 1,
  pageSize = 5,
  orderBy = SCCommentsOrderBy.ADDED_AT_DESC,
  parent = null,
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType: SCFeedObjectTypologyType;
  offset?: number;
  page?: number;
  pageSize?: number;
  orderBy?: SCCommentsOrderBy;
  parent?: number;
}) {
  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [comments, setComments] = useState<SCCommentType[]>([]);
  const mounted = useRef(false);

  const log = () => {
    console.log(obj.id, offset, page, pageSize, orderBy, parent, mounted.current, next);
  };

  /**
   * Get next url
   */
  const getNextUrl = () => {
    const _offset = `&offset=${offset ? offset : (page - 1) * pageSize}`;
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
    if (obj && previous) {
      setIsLoadingPrevious(true);
      performFetchComments(previous)
        .then((res) => {
          setComments([...res.results, ...comments]);
          setPrevious(res.previous);
          setIsLoadingPrevious(false);
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
    if (obj && next) {
      setIsLoadingNext(true);
      performFetchComments(next)
        .then((res) => {
          setComments([...comments, ...res.results]);
          setNext(res.next);
          setTotal(res.count);
          if (page > 1 && comments.length === 0) {
            // Save initial previous if start from a page > 1
            setPrevious(res.previous);
          }
          setIsLoadingNext(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_CORE, error);
        });
    }
  }

  /**
   * Change orderBy, page, pageSize, offset
   * Reset comments sets
   */
  useEffect(() => {
    if (mounted.current && obj) {
      setNext(getNextUrl());
      setComments([]);
      setTotal(0);
      setPrevious(null);
      // getNextPage();
    }
  }, [orderBy, pageSize, page, offset]);

  /**
   * When comments.length === 0 and the component is mounted
   * Auto fetch comments
   */
  useEffect(() => {
    if (mounted.current && comments.length === 0 && obj) {
      getNextPage();
    }
  }, [comments]);

  /**
   * Track component mount/unmount
   */
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
    log,
  };
}
