import { useEffect, useMemo, useRef, useState } from "react";

/**
 :::info
 This custom hook manages cached data and the loading state.
 :::
 */
export default function useSCCachingManager() {
  // Elements(id) already loaded
  const cache = useRef<number[]>([]);
  // Elements(id) current in loading
  const loadingCache = useRef<number[]>([]);

  // Trigger state changes
  const [loading, setDataLoading] = useState([]);
  const [data, setData] = useState([]);

  /**
   * Update cache
   * @param ids
   */
  const updateCache = useMemo(
    () =>
      (ids: number[]): void => {
        ids.map((c) => {
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
      loadingCache.current = [];
    },
    [cache]
  );

  /**
   * Category is checking
   * Return true if the manager is checking
   * the follow status of the obj
   * @param category
   */
  const isLoading = useMemo(
    () =>
      (obj: {id: number}): boolean => {
        console.log('isLoading', loadingCache, loadingCache.current.includes(obj.id));
        return loadingCache.current.includes(obj.id);
      },
    [loading, loadingCache]
  );

  const setLoading = useMemo(
    () =>
      (id: number): void => {
        loadingCache.current = loadingCache.current.includes(id) ? loadingCache.current : [...loadingCache.current, ...[id]];
        setDataLoading((prev) => (prev.includes(id) ? prev : [...prev, ...[id]]));
        console.log('loadingCache: ', loadingCache.current);
      },
    [loadingCache, loading]
  );

  const setUnLoading = useMemo(
    () =>
      (id: number): void => {
        loadingCache.current = loadingCache.current.filter((u) => u !== id);
        setDataLoading((prev) => prev.filter((u) => u !== id));
      },
    [loadingCache, loading]
  );

  return {cache: cache.current, updateCache, emptyCache, data, setData, loading, setLoading, setUnLoading, isLoading};
}
