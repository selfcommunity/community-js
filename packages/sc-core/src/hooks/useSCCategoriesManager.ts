import {useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCCategoryType} from '../types';

/**
 * Custom hook 'useSCCategoriesManager'
 * Use this hook to manage categories followed:
 * 1. const scUserContext: SCUserContextType = useSCUser();
 * 2. const scCategoriesManager: SCCategoriesManagerType = scUserContext.manager.categories;
 * 3. scCategoriesManager.isFollowed(category)
 */
export default function useSCCategoriesManager() {
  const cache = useRef<number[]>([]);
  const [categories, setCategories] = useState<SCCategoryType[]>([]);
  const [loading, setLoading] = useState<number[]>([]);

  /**
   * Update categories cache
   * @param categoryIds
   */
  const updateCache = useMemo(
    () =>
      (categoryIds: number[]): void => {
        categoryIds.map((c) => {
          if (!cache.current.includes(c)) {
            cache.current.push(c);
          }
        });
      },
    [cache]
  );

  /**
   * Empty cache
   * emptying the cache each isFollow request
   * results in a request to the server
   */
  const emptyCache = useMemo(
    () => (): void => {
      cache.current = [];
    },
    [cache]
  );

  /**
   * Category is checking
   * Return true if the manager is checking
   * the follow status of the category
   * @param category
   */
  const isLoading = useMemo(
    () =>
      (category: SCCategoryType): boolean => {
        return loading.includes(category.id);
      },
    [loading]
  );

  /**
   * Memoized refresh all categories
   * It makes a single request to the server and retrieves
   * all the categories followed by the user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => () => {
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
          setCategories(res.data);
          return Promise.resolve(res.data);
        });
    },
    [categories, cache]
  );

  /**
   * Memoized follow/unfollow Category
   * Toggle action
   */
  const follow = useMemo(
    () => (category: SCCategoryType) => {
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
          const isFollowed = categories.filter((c) => c.id === category.id).length > 0;
          if (isFollowed) {
            setCategories(categories.filter((c: SCCategoryType) => c.id !== category.id));
          } else {
            setCategories([...[category], ...categories]);
          }
          setLoading((prev) => prev.filter((c) => c !== category.id));
          return Promise.resolve(res.data);
        });
    },
    [categories, loading, cache]
  );

  /**
   * Check if the user follow the category
   * Update the categories cached
   * Update categories followed
   * @param category
   */
  const checkIsCategoryFollowed = (category: SCCategoryType) => {
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
          setCategories((prev) => [...[category], ...prev]);
        } else {
          setCategories((prev) => prev.filter((c: SCCategoryType) => c.id !== category.id));
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
          return Boolean(categories.filter((c) => c.id === category.id).length);
        }
        if (!loading.includes(category.id)) {
          checkIsCategoryFollowed(category);
        }
        return false;
      },
    [categories, loading, cache]
  );

  return {categories, loading, isLoading, follow, isFollowed, refresh, emptyCache};
}
