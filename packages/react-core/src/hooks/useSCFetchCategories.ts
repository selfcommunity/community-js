import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCategoryType} from '@selfcommunity/types';
import {CategoryParams, CategoryService, Endpoints} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getCategoriesObjectCacheKey, getCategoryObjectCacheKey} from '../constants/Cache';
import {AxiosRequestConfig} from 'axios/index';

const init = {categories: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[], endpointQueryParams?: CategoryParams) => {
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

  if (endpointQueryParams?.can_create_content) {
    return categories.filter((c) => c.content_only_staff);
  }

  return categories;
};

/**
 :::info
 This custom hook is used to fetch categories.

 :::tip Context can be consumed in this way:

 ```jsx
 const {categories, isLoading} = useSCFetchCategories();
 ```
 :::
 * @param props
 */
const useSCFetchCategories = (props?: {cacheStrategy?: CacheStrategies; endpointQueryParams?: CategoryParams}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST, endpointQueryParams = {}} = props || {};

  // CACHE
  const __categoriesCacheKey = getCategoriesObjectCacheKey();

  // STATE
  const categories = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__categoriesCacheKey, null), endpointQueryParams) : null;
  const [data, setData] = useState<{categories: SCCategoryType[]; isLoading: boolean}>(categories !== null ? {categories, isLoading: false} : init);

  /**
   * Fetch categories
   */
  const fetchCategories = async (next: string = Endpoints.CategoryList.url()): Promise<[]> => {
    const data: any = await CategoryService.getAllCategories({active: true, ...endpointQueryParams}, {url: next} as AxiosRequestConfig);
    return data.next ? data.results.concat(await fetchCategories(data.next)) : data.results;
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
