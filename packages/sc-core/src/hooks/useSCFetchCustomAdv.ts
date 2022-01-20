import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {Endpoints, http, Logger, SCCustomAdvType, SCTagType} from '@selfcommunity/core';
import {SCCategoryType, SCCustomAdvPosition} from '../types';

/**
 * Custom hook 'useSCFetchCustomAdv'
 * Use this hook to fetch a custom adv object
 * @param position
 * @param category
 */
export default function useSCFetchCustomAdv({position = null, categoryId = null}: {position: SCCustomAdvPosition; categoryId?: number}) {
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
            ...(categoryId ? {category: categoryId} : {}),
          },
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data.results);
        });
    },
    [position, categoryId]
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
  }, [position, categoryId]);

  return {scCustomAdv, setSCCustomAdv};
}
