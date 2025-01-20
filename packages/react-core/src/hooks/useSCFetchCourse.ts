import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCCourseType} from '@selfcommunity/types';
import {CacheStrategies, Logger, LRUCache, objectWithoutProperties} from '@selfcommunity/utils';
import {useEffect, useMemo, useState} from 'react';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {getCourseObjectCacheKey} from '../constants/Cache';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch an course object.
 :::
 * @param object
 * @param object.id
 * @param object.course
 * @param object.cacheStrategy
 */
export default function useSCFetchCourse({
  id = null,
  course = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  course?: SCCourseType;
  cacheStrategy?: CacheStrategies;
}) {
  const __courseId = useMemo(() => course?.id || id, [course, id]);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = useMemo(() => scUserContext.user?.id || null, [scUserContext.user]);

  // CACHE
  const __courseCacheKey = useMemo(() => getCourseObjectCacheKey(__courseId), [__courseId]);
  const __course = useMemo(() => (authUserId ? course : objectWithoutProperties<SCCourseType>(course, ['join_status'])), [authUserId, course]);

  const [scCourse, setScCourse] = useState<SCCourseType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__courseCacheKey, __course) : null
  );
  const [error, setError] = useState<string>(null);

  const setSCCourse = (course: SCCourseType) => {
    const _c: SCCourseType = authUserId ? course : objectWithoutProperties<SCCourseType>(course, ['join_status']);
    setScCourse(_c);
    LRUCache.set(__courseCacheKey, _c);
  };

  /**
   * Memoized fetchTag
   */
  const fetchCourse = useMemo(
    () => (id: string | number) => {
      return http
        .request({
          url: Endpoints.GetCourseInfo.url({id}),
          method: Endpoints.GetCourseInfo.method,
        })
        .then((res: HttpResponse<SCCourseType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * If id attempt to get the course by id
   */
  useEffect(() => {
    if (id !== null && id !== undefined && !course) {
      fetchCourse(id)
        .then((e: SCCourseType) => {
          setSCCourse(e);
        })
        .catch((err) => {
          LRUCache.delete(__courseCacheKey);
          setError(`Course with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Course with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id, course, authUserId]);

  useDeepCompareEffectNoCheck(() => {
    if (course) {
      setSCCourse(course);
    }
  }, [course, authUserId]);

  return {scCourse, setSCCourse, error};
}
