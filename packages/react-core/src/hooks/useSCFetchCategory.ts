import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType, SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '../utils/logger';

/**
 :::info
 This custom hook is used to fetch a category object.
 :::
 * @param object
 * @param object.id
 * @param object.category
 */
export default function useSCFetchCategory({id = null, category = null}: {id?: number; category?: SCCategoryType}) {
  const [scCategory, setSCCategory] = useState<SCCategoryType>(category);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchTag
   */
  const fetchCategory = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Category.url({id: id}),
          method: Endpoints.Category.method,
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
   * If id attempt to get the category by id
   */
  useEffect(() => {
    if (id) {
      fetchCategory()
        .then((obj: SCCategoryType) => {
          setSCCategory(obj);
        })
        .catch((err) => {
          setError(`Category with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Category with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scCategory, setSCCategory, error};
}
