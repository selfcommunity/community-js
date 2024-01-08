import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCPrivateMessageSnippetType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getPmSnippetObjectCacheKey, getPmSnippetsObjectCacheKey} from '../constants/Cache';
import {useSCUser} from '../components/provider/SCUserProvider';
const init = {snippets: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[]) => {
  if (!ids) {
    return null;
  }
  const snippets: SCPrivateMessageSnippetType[] = ids.map((id) => {
    const __snippetCacheKey = getPmSnippetObjectCacheKey(id);
    return LRUCache.get(__snippetCacheKey);
  });

  if (snippets.filter((c) => !c).length > 0) {
    // REVALIDATE CACHE
    return null;
  }

  return snippets;
};

/**
 :::info
 This custom hook is used to fetch snippets.
 @param object.cacheStrategy

 :::tip Context can be consumed in this way:

 ```jsx
 const {snippets, isLoading} = useSCFetchPrivateMessageSnippets();
 ```
 :::
 * @param props
 */
const useSCFetchPrivateMessageSnippets = (props?: {cacheStrategy?: CacheStrategies}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // CACHE
  const __snippetsCacheKey = getPmSnippetsObjectCacheKey();

  // STATE
  const snippets = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__snippetsCacheKey, null)) : null;
  const [data, setData] = useState<{snippets: SCPrivateMessageSnippetType[]; isLoading: boolean}>(
    snippets !== null ? {snippets, isLoading: false} : init
  );

  // HOOKS
  const scUserContext = useSCUser();
  /**
   * Fetch snippets
   */
  const fetchSnippets = async (next: string = Endpoints.GetSnippets.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetSnippets.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchSnippets(data.next));
    }
    return data.results;
  };

  /**
   * Get snippets
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && snippets) {
      return;
    }
    fetchSnippets()
      .then((data) => {
        setData({snippets: data, isLoading: false});
        LRUCache.set(
          __snippetsCacheKey,
          data.map((snippet: SCPrivateMessageSnippetType) => {
            const __snippetCacheKey = getPmSnippetObjectCacheKey(snippet.id);
            LRUCache.set(__snippetCacheKey, snippet);
            return snippet.id;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve snippets');
      });
  }, []);

  /**
   * Updated snippets list
   * @param updatedData
   */
  const updateSnippets = (updatedData) => {
    if (updatedData) {
      setData({snippets: updatedData, isLoading: false});
      //cache update
      LRUCache.set(
        __snippetsCacheKey,
        updatedData.map((snippet: SCPrivateMessageSnippetType) => {
          const __snippetCacheKey = getPmSnippetObjectCacheKey(snippet.id);
          LRUCache.set(__snippetCacheKey, snippet);
          return snippet.id;
        })
      );
    }
  };

  return {data, updateSnippets};
};

export default useSCFetchPrivateMessageSnippets;
