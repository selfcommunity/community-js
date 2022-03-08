import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCTagType} from '../types';
import http from '../utils/http';
import {Logger} from '../utils/logger';
import Endpoints from '../constants/Endpoints';

/**
 :::info
 This custom hook is used to fetch a tag object.
 :::
*  @param object
 * @param object.id
 * @param object.tag
 */
export default function useSCFetchTag({id = null, tag = null}: {id?: number; tag?: SCTagType}) {
  const [scTag, setSCTag] = useState<SCTagType>(tag);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchTag
   */
  const fetchTag = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Tag.url({id: id}),
          method: Endpoints.Tag.method,
        })
        .then((res: AxiosResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id]
  );

  /**
   * If id attempt to get the tag by id
   */
  useEffect(() => {
    if (id) {
      fetchTag()
        .then((obj: SCTagType) => {
          setSCTag(obj);
        })
        .catch((err) => {
          setError(`Tag with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Tag with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scTag, setSCTag, error};
}
