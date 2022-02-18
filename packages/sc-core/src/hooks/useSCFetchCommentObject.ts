import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCommentType} from '../types/comment';
import http from '../utils/http';
import {Logger} from '../utils/logger';
import Endpoints from '../constants/Endpoints';

/**
 :::info
 This custom hooks is used to fetch a comment.
 :::

 * @param id
 * @param commentObject
 */
export default function useSCFetchCommentObject({id = null, commentObject = null}: {id?: number; commentObject?: SCCommentType}) {
  const [obj, setObj] = useState<SCCommentType>(commentObject);

  /**
   * Memoized fetchCommentObject
   */
  const fetchCommentObject = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Comment.url({id: id}),
          method: Endpoints.Comment.method,
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id]
  );

  /**
   * If id and feedObjectType resolve feddObject
   */
  useEffect(() => {
    if (id) {
      fetchCommentObject()
        .then((obj) => {
          setObj(obj);
        })
        .catch((err) => {
          Logger.error(SCOPE_SC_CORE, `CommentObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {obj, setObj};
}
