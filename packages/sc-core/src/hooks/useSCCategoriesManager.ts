import {useMemo, useRef, useState} from 'react';
import {AxiosResponse} from 'axios';
import http from '../utils/http';
import Endpoints from '../constants/Endpoints';
import {SCCategoryType} from '../types';

/**
 * Custom hook 'useSCCategoriesManager'
 * Use this hook to manage categories
 */
export default function useSCCategoriesManager() {
  const cache = useRef<number[]>([]);
  const [categories, setCategories] = useState<SCCategoryType[]>([]);
  const [loading, setLoading] = useState<number[]>([]);

  /**
   * Sync categories cache
   * @param categoryId
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
   * @param categoryId
   */
  const emptyCache = useMemo(
    () => (): void => {
      cache.current = [];
    },
    [cache]
  );

  /**
   * Category is checking
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
          setLoading(loading.filter((c) => c !== category.id));
          const isFollowed = categories.filter((c) => c.id === category.id).length > 0;
          if (isFollowed) {
            setCategories(categories.filter((c: SCCategoryType) => c.id !== category.id));
          } else {
            setCategories([...[category], ...categories]);
          }
          return Promise.resolve(res.data);
        });
    },
    [categories, loading, cache]
  );

  const checkIsCategoryFollowed = (category: SCCategoryType) => {
    setLoading((prev) => [...prev, ...[category.id]]);
    return http
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
        setLoading(loading.filter((c) => c !== category.id));
        return Promise.resolve(res.data);
      });
  };

  /**
   * Memoized isCategoryFollowed
   */
  const isFollowed = useMemo(
    () =>
      (category: SCCategoryType): boolean => {
        if (cache.current.includes(category.id)) {
          return Boolean(categories.filter((c) => c.id === category.id).length);
        }
        if (!loading.includes(category.id)) {
          setTimeout(() => {
            checkIsCategoryFollowed(category);
          });
        }
        return false;
      },
    [categories, cache]
  );

  return {categories, isLoading, follow, isFollowed, refresh, emptyCache};
}
