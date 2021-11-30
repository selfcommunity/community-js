import {useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCCategoryType} from '../types';
import useSCCachingManager from './useSCCachingManager';

/**
 * Custom hook 'useSCCategoriesManager'
 * Use this hook to manage categories followed:
 * 1. const scUserContext: SCUserContextType = useSCUser();
 * 2. const scCategoriesManager: SCCategoriesManagerType = scUserContext.manager.categories;
 * 3. scCategoriesManager.isFollowed(category)
 */
export default function useSCCategoriesManager() {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, isLoading} = useSCCachingManager();

  /**
   * Memoized refresh all categories
   * It makes a single request to the server and retrieves
   * all the categories followed by the user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): Promise<any> => {
      return http
        .request({
          url: Endpoints.FollowedCategories.url(),
          method: Endpoints.FollowedCategories.method,
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          updateCache(res.data.map((c: SCCategoryType) => c.id));
          setData(res.data);
          return Promise.resolve(res.data);
        });
    },
    [data, cache]
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
            const isFollowed = data.filter((c) => c.id === category.id).length > 0;
            if (isFollowed) {
              setData(data.filter((c: SCCategoryType) => c.id !== category.id));
            } else {
              setData([...[category], ...data]);
            }
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
        if (res.data.is_followed) {
          setData((prev) => [...[category], ...prev]);
        } else {
          setData((prev) => prev.filter((c: SCCategoryType) => c.id !== category.id));
        }
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
        if (cache.current.includes(category.id)) {
          return Boolean(data.filter((c) => c.id === category.id).length);
        }
        if (!loading.includes(category.id)) {
          checkIsCategoryFollowed(category);
        }
        return false;
      },
    [data, loading, cache]
  );

  return {categories: data, loading, isLoading, follow, isFollowed, refresh, emptyCache};
}
