import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCCourseLessonType} from '@selfcommunity/types';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {useEffect, useMemo, useState} from 'react';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {useSCUser} from '../components/provider/SCUserProvider';
import {getLessonObjectCacheKey} from '../constants/Cache';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCUserContextType} from '../types/context';

/**
 :::info
 This custom hook is used to fetch a lesson object.
 :::
 * @param object
 * @param object.id
 * @param object.lesson
 * @param object.cacheStrategy
 */
export default function useSCFetchLesson({
  id = null,
  lesson = null,
  courseId = null,
  sectionId = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number | string;
  lesson?: SCCourseLessonType;
  courseId: number | string;
  sectionId: number | string;
  cacheStrategy?: CacheStrategies;
}) {
  const __lessonId = useMemo(() => lesson?.id || id, [lesson, id]);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const authUserId = useMemo(() => scUserContext.user?.id || null, [scUserContext.user]);

  // CACHE
  const __lessonCacheKey = useMemo(() => getLessonObjectCacheKey(__lessonId), [__lessonId]);
  const [scLesson, setScLesson] = useState<SCCourseLessonType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__lessonCacheKey, lesson) : null
  );
  const [error, setError] = useState<string>(null);

  const setSCLesson = (lesson: SCCourseLessonType) => {
    setScLesson(lesson);
    LRUCache.set(__lessonCacheKey, lesson);
  };

  /**
   * Memoized fetchTag
   */
  const fetchLesson = useMemo(
    () => (id: string | number) => {
      return http
        .request({
          url: Endpoints.GetCourseLesson.url({id: courseId, section_id: sectionId, lesson_id: id}),
          method: Endpoints.GetCourseLesson.method,
        })
        .then((res: HttpResponse<SCCourseLessonType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [courseId, sectionId, id]
  );

  /**
   * If id attempt to get the lesson by id
   */
  useEffect(() => {
    if (__lessonId && courseId && sectionId) {
      fetchLesson(__lessonId)
        .then((e: SCCourseLessonType) => {
          setSCLesson(e);
        })
        .catch((err) => {
          LRUCache.delete(__lessonCacheKey);
          setError(`Lesson with id ${__lessonId} not found`);
          Logger.error(SCOPE_SC_CORE, `Lesson with id ${__lessonId} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__lessonId, courseId, sectionId]);

  useDeepCompareEffectNoCheck(() => {
    if (lesson) {
      setSCLesson(lesson);
    }
  }, [lesson, authUserId]);

  return {scLesson, setSCLesson, error};
}
