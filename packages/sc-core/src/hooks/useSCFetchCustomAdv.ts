import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import http from '../utils/http';
import {Logger} from '../utils/logger';
import Endpoints from '../constants/Endpoints';
import {SCCustomAdvPosition, SCCustomAdvType} from '../types';

/**
 :::info
 This custom hook is used to fetch a custom adv object.
 :::
 * @param object
 * @param object.position
 * @param object.categoryId
 */
export default function useSCFetchCustomAdv({position = null, categoriesId = null}: {position: SCCustomAdvPosition; categoriesId?: Array<number>}) {
  const [scCustomAdv, setSCCustomAdv] = useState<SCCustomAdvType | null>(null);

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
            position,
            ...(categoriesId && {categories: `[${categoriesId.toString()}]`}),
          },
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data.results);
        });
    },
    [position, `${categoriesId}`]
  );

  /**
   * If id attempt to get the category by id
   */
  useEffect(() => {
    fetchCustomAdv()
      .then((objects: SCCustomAdvType[]) => {
        setSCCustomAdv(objects[Math.floor(Math.random() * objects.length)]);
      })
      .catch((err) => {
        Logger.error(SCOPE_SC_CORE, `Custom ADV with position ${position} not found`);
        Logger.error(SCOPE_SC_CORE, err.message);
      });
  }, [position, `${categoriesId}`]);

  return {scCustomAdv, setSCCustomAdv};
}
