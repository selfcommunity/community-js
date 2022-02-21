import {useEffect, useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCCategoryType, SCUserType} from '../types';
import useSCCachingManager from './useSCCachingManager';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {Logger} from '../utils/logger';

/**
 :::info
 This custom hook is used to manage the categories followed.
 :::

 :::tipHow to use it:
 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scCategoriesManager: SCCategoriesManagerType = scUserContext.manager.categories;
 3. scCategoriesManager.isFollowed(category)
 ```
 :::
 */
export default function useSCCategoriesManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, isLoading} = useSCCachingManager();

  /**
   * Memoized refresh all categories
   * It makes a single request to the server and retrieves
   * all the categories followed by the user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (user && cache.length > 0) {
        // Only if user is authenticated
        http
          .request({
            url: Endpoints.FollowedCategories.url({id: user.id}),
            method: Endpoints.FollowedCategories.method,
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            const categoryIds = res.data.map((c: SCCategoryType) => c.id);
            updateCache(categoryIds);
            setData(categoryIds);
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh categories followed by the authenticated user.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized follow/unfollow Category
   * Toggle action
   */
  const follow = useMemo(
    () =>
      (category: SCCategoryType): Promise<any> => {
        setLoading((prev) => [...prev, ...[category.id]]);
        return http
          .request({
            url: Endpoints.FollowCategory.url({id: category.id}),
            method: Endpoints.FollowCategory.method,
          })
          .then((res: AxiosResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            updateCache([category.id]);
            const isFollowed = data.includes(category.id);
            setData((prev) => (isFollowed ? prev.filter((id) => id !== category.id) : [...[category.id], ...prev]));
            setLoading((prev) => prev.filter((c) => c !== category.id));
            return Promise.resolve(res.data);
          });
      },
    [data, loading, cache]
  );

  /**
   * Check if the user follow the category
   * Update the categories cached
   * Update categories followed
   * @param category
   */
  const checkIsCategoryFollowed = (category: SCCategoryType): void => {
    setLoading((prev) => (prev.includes(category.id) ? prev : [...prev, ...[category.id]]));
    http
      .request({
        url: Endpoints.CheckCategoryIsFollowed.url({id: category.id}),
        method: Endpoints.CheckCategoryIsFollowed.method,
      })
      .then((res: AxiosResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        updateCache([category.id]);
        setData((prev) => (res.data.is_followed ? [...[category.id], ...prev] : prev.filter((id) => id !== category.id)));
        setLoading((prev) => prev.filter((c) => c !== category.id));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Memoized isFollowed
   * If category is already in cache -> check if the category is in categories,
   * otherwise, check if user follow the category
   */
  const isFollowed = useMemo(
    () =>
      (category: SCCategoryType): boolean => {
        if (cache.includes(category.id)) {
          return Boolean(data.includes(category.id));
        }
        if (!loading.includes(category.id)) {
          checkIsCategoryFollowed(category);
        }
        return false;
      },
    [data, loading, cache]
  );

  if (!user) {
    return {categories: data, loading, isLoading};
  }
  return {categories: data, loading, isLoading, follow, isFollowed, refresh, emptyCache};
}
