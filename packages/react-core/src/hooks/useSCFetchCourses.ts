import {useEffect, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCourseType} from '@selfcommunity/types';
import {Endpoints, http} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getCourseObjectCacheKey, getCoursesObjectCacheKey} from '../constants/Cache';

const init = {courses: [], isLoading: true};

// HYDRATE the cache
const hydrate = (ids: number[]) => {
  if (!ids) {
    return null;
  }
  const courses: SCCourseType[] = ids.map((id) => {
    const __eventCacheKey = getCourseObjectCacheKey(id);
    return LRUCache.get(__eventCacheKey);
  });

  if (courses.filter((c) => !c).length > 0) {
    // REVALIDATE CACHE
    return null;
  }

  return courses;
};

/**
 :::info
 This custom hook is used to fetch courses.
 @param object.cacheStrategy

 :::tip Context can be consumed in this way:

 ```jsx
 const {courses, isLoading} = useSCFetchCourses();
 ```
 :::
 * @param props
 */
const useSCFetchCourses = (props?: {cacheStrategy?: CacheStrategies}) => {
  // PROPS
  const {cacheStrategy = CacheStrategies.CACHE_FIRST} = props || {};

  // CACHE
  const __coursesCacheKey = getCoursesObjectCacheKey();

  // STATE
  const courses = cacheStrategy !== CacheStrategies.NETWORK_ONLY ? hydrate(LRUCache.get(__coursesCacheKey, null)) : null;
  const [data, setData] = useState<{courses: SCCourseType[]; isLoading: boolean}>(courses !== null ? {courses, isLoading: false} : init);

  /**
   * Fetch courses
   */
  const fetchCourses = async (next: string = Endpoints.GetUserCourses.url()): Promise<[]> => {
    const response = await http.request({
      url: next,
      method: Endpoints.GetUserCourses.method,
    });
    const data: any = response.data;
    if (data.next) {
      return data.results.concat(await fetchCourses(data.next));
    }
    return data.results;
  };

  /**
   * Get courses
   */
  useEffect(() => {
    if (cacheStrategy === CacheStrategies.CACHE_FIRST && courses) {
      return;
    }
    fetchCourses()
      .then((data) => {
        setData({courses: data, isLoading: false});
        LRUCache.set(
          __coursesCacheKey,
          data.map((event: SCCourseType) => {
            const __eventCacheKey = getCourseObjectCacheKey(event.id);
            LRUCache.set(__eventCacheKey, event);
            return event.id;
          })
        );
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_CORE, 'Unable to retrieve courses');
      });
  }, []);

  return data;
};

export default useSCFetchCourses;
