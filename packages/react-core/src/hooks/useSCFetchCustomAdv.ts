import {useEffect, useMemo, useRef, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCCustomAdvPosition, SCCustomAdvType} from '@selfcommunity/types';

/**
 :::info
 This custom hook is used to fetch a custom adv object.
 :::
 * @param object
 * @param object.position
 * @param object.categoryId
 */
export default function useSCFetchCustomAdv({position = null, categoriesId = null}: {position?: SCCustomAdvPosition; categoriesId?: Array<number>}) {
  const [scCustomAdv, setSCCustomAdv] = useState<SCCustomAdvType | null>(null);
  const [error, setError] = useState<string>(null);
  const mounted = useRef(false);

  /**
   * Memoized fetchCustomAdv
   */
  const fetchCustomAdv = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.CustomAdvSearch.url(),
          method: Endpoints.CustomAdvSearch.method,
          params: {
            ...(position && {position: position}),
            ...(categoriesId && {categories: `[${categoriesId.toString()}]`}),
          },
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data.results);
        });
    },
    [position, `${categoriesId}`]
  );

  /**
   * Track mount/unmount
   */
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /**
   * If id attempt to get the category by id
   */
  useEffect(() => {
    fetchCustomAdv()
      .then((objects: SCCustomAdvType[]) => {
        if (mounted.current) {
          setSCCustomAdv(objects[Math.floor(Math.random() * objects.length)]);
        }
      })
      .catch((err) => {
        if (mounted.current) {
          setError(`Custom ADV with position ${position} not found`);
        }
        Logger.error(SCOPE_SC_CORE, `Custom ADV with position ${position} not found`);
        Logger.error(SCOPE_SC_CORE, err.message);
      });
  }, [position, `${categoriesId}`]);

  return {scCustomAdv, setSCCustomAdv, error};
}
