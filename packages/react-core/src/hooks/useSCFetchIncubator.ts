import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCIncubatorType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';

/**
 :::info
 This custom hook is used to fetch an incubator object.
 :::
 * @param object
 * @param object.id
 * @param object.incubator
 */
export default function useSCFetchIncubator({id = null, incubator = null}: {id?: number; incubator?: SCIncubatorType}) {
  const [scIncubator, setSCIncubator] = useState<SCIncubatorType>(incubator);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchIncubator
   */
  const fetchIncubator = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetASpecificIncubator.url({id: id}),
          method: Endpoints.GetASpecificIncubator.method,
        })
        .then((res: HttpResponse<SCIncubatorType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id]
  );

  /**
   * If id resolve the obj
   */
  useEffect(() => {
    if (id) {
      fetchIncubator()
        .then((obj: SCIncubatorType) => {
          setSCIncubator(obj);
        })
        .catch((err) => {
          setError(`Incubator with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Incubator with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scIncubator, setSCIncubator, error};
}
