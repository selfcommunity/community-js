import {useMemo, useRef, useState} from 'react';

/**
 :::info
 This custom hook manages cached data and the loading state.
 :::
 */
export default function useSCCachingManager() {
  const cache = useRef<number[]>([]);
  const [loading, setLoading] = useState<number[]>([]);
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
        return loading.includes(obj.id);
      },
    [loading]
  );

  return {cache: cache.current, updateCache, emptyCache, data, setData, loading, setLoading, isLoading};
}
