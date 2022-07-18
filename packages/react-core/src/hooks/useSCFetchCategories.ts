import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getCategoriesObjectCacheKey, getCategoryObjectCacheKey} from '../constants/Cache';

const init = {categories: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[]) => {
  if (!ids) {
    return null;
  }
  const categories: SCCategoryType[] = ids.map((id) => {
    const __categoryCacheKey = getCategoryObjectCacheKey(id);
    return LRUCache.get(__categoryCacheKey);
  });

  if (categories.filter((c) => !c).length > 0) {
    // REVALIDATE CACHE
    return null;
  }

  return categories;
};

/**
 :::info
 This custom hook is used to fetch categories.
 @param object
 @param object.cacheStrategy

 :::tipContext can be consumed in this way:

 ```jsx
 const {categories, isLoading} = useSCFetchCategories();
 ```
 :::
 */
const useSCFetchCategories = (props?: {cacheStrategy?: CacheStrategies}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // CACHE
  const __categoriesCacheKey = getCategoriesObjectCacheKey();

  // STATE
  const categories = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__categoriesCacheKey, null)) : null;
  const [data, setData] = useState<{categories: SCCategoryType[]; isLoading: boolean}>(categories !== null ? {categories, isLoading: false} : init);

  /**
   * Fetch categories
   */
  const fetchCategories = async (next: string = Endpoints.CategoryList.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.CategoryList.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchCategories(data.next));
    }
    return data.results;
  };

  /**
   * Get categories
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && categories) {
      return;
    }
    fetchCategories()
      .then((data) => {
        setData({categories: data, isLoading: false});
        LRUCache.set(
          __categoriesCacheKey,
          data.map((cat: SCCategoryType) => {
            const __categoryCacheKey = getCategoryObjectCacheKey(cat.id);
            LRUCache.set(__categoryCacheKey, cat);
            return cat.id;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve categories');
      });
  }, []);

  return data;
};

export default useSCFetchCategories;
