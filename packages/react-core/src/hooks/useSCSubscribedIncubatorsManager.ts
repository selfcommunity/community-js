import {useMemo} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCIncubatorType, SCUserType} from '@selfcommunity/types';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';
import useSCCachingManager from './useSCCachingManager';

/**
 :::info
 This custom hook is used to manage to manage subscribed incubators.
 :::
 :::tipHow to use it:

 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scSubscribedIncubatorsManager: SCSubscribedIncubatorsManagerType = scUserContext.managers.incubators;
 3. scSubscribedIncubatorsManager.isSubscribed(incubator)
 ```
 :::
 */
export default function useSCSubscribedIncubatorsManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, isLoading} = useSCCachingManager();

  /**
   * Memoized refresh all subscribed
   * It makes a single request to the server and retrieves
   * all the incubators subscribed by the authenticated user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (user) {
        // Only if user is authenticated
        http
          .request({
            url: Endpoints.GetAllIncubators.url({}),
            method: Endpoints.GetAllIncubators.method,
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache(Object.keys(res.data.results).map((id) => parseInt(id)));
            setData(
              Object.entries(res.data.results)
                .filter(([k, v]) => v === true)
                .map(([k, v]) => parseInt(k))
            );
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh incubators subscribed by the authenticated user.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized subscribe/unsubscribe incubator
   * Toggle action
   */
  const subscribe = useMemo(
    () =>
      (incubator: SCIncubatorType): Promise<any> => {
        setLoading((prev) => [...prev, ...[incubator.id]]);
        return http
          .request({
            url: Endpoints.SubscribeToIncubator.url({id: incubator.id}),
            method: Endpoints.SubscribeToIncubator.method,
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache([incubator.id]);
            const isSubscribed = data.includes(incubator.id);
            setData((prev) => (isSubscribed ? prev.filter((id) => id !== incubator.id) : [...[incubator.id], ...prev]));
            setLoading((prev) => prev.filter((i) => i !== incubator.id));
            return Promise.resolve(res.data);
          });
      },
    [data, loading, cache]
  );

  /**
   * Check if the authenticated user has subscribed the incubator
   * Update the subscribed cached
   * Update subscribed incubators
   * @param incubator
   */
  const checkIsIncubatorFollowed = (incubator: SCIncubatorType): void => {
    setLoading((prev) => (prev.includes(incubator.id) ? prev : [...prev, ...[incubator.id]]));
    http
      .request({
        url: Endpoints.CheckIncubatorSubscription.url({id: incubator.id}),
        method: Endpoints.CheckIncubatorSubscription.method,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        updateCache([incubator.id]);
        setData((prev) => (res.data.subscribed ? [...prev, ...[incubator.id]] : prev.filter((id) => id !== incubator.id)));
        setLoading((prev) => prev.filter((i) => i !== incubator.id));
        return Promise.resolve(res.data);
      });
  };

  // /**
  //  * Bypass remote check if the incubator is subscribed
  //  */
  // const getSubscriptionStatus = useMemo(
  //   () => (incubator: SCIncubatorType) => {
  //     const isSubscribed = incubator.subscribed === true;
  //     updateCache([incubator.id]);
  //     setData((prev) => (isSubscribed ? [...prev, ...[incubator.id]] : prev));
  //     return isSubscribed;
  //   },
  //   [data, cache]
  // );

  /**
   * Memoized isSubscribed
   * If incubator is already in cache -> check if the incubator is in subscribed,
   * otherwise, check if auth user is subscribed to the incubator
   */
  const isSubscribed = useMemo(
    () =>
      (incubator: SCIncubatorType): boolean => {
        if (cache.includes(incubator.id)) {
          return Boolean(data.includes(incubator.id));
        }
        // if ('subscribed' in incubator) {
        //   return getSubscriptionStatus(incubator);
        // }
        if (!loading.includes(incubator.id)) {
          checkIsIncubatorFollowed(incubator);
        }
        return false;
      },
    [data, loading, cache]
  );

  return {incubators: data, loading, isLoading, subscribe, isSubscribed, refresh, emptyCache};
}
