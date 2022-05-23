import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';

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
        .then((res: HttpResponse<SCTagType>) => {
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
