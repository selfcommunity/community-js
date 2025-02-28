import {useEffect, useMemo, useState} from 'react';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCCourseCommentType, SCCourseLessonType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger, LRUCache} from '@selfcommunity/utils';
import {getLessonCommentCacheKey} from '../constants/Cache';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

/**
 :::info
 This custom hooks is used to fetch a course lesson comment.
 :::
 * @param object
 * @param object.id
 * @param object.commentObject
 * @param object.lesson
 * @param object.cacheStrategy
 */
export default function useSCFetchLessonCommentObject({
  id = null,
  commentObject = null,
  lesson = null,
  cacheStrategy = CacheStrategies.CACHE_FIRST,
}: {
  id?: number;
  commentObject?: SCCourseCommentType;
  lesson: SCCourseLessonType;
  cacheStrategy?: CacheStrategies;
}) {
  const __commentObjectId = commentObject ? commentObject.id : id;

  // CACHE
  const __commentObjectCacheKey = getLessonCommentCacheKey(__commentObjectId);

  const [obj, setObj] = useState<SCCourseCommentType>(
    cacheStrategy !== CacheStrategies.NETWORK_ONLY ? LRUCache.get(__commentObjectCacheKey, commentObject) : commentObject
  );
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchLessonCommentObject
   */
  const fetchLessonCommentObject = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetCourseLessonComment.url({
            id: lesson.course_id,
            section_id: lesson.section_id,
            lesson_id: lesson.id,
            comment_id: __commentObjectId,
          }),
          method: Endpoints.GetCourseLessonComment.method,
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [__commentObjectId, lesson]
  );

  /**
   * If course commentObject resolve it
   */
  useEffect(() => {
    if (__commentObjectId && lesson && (!obj || cacheStrategy === CacheStrategies.STALE_WHILE_REVALIDATE)) {
      fetchLessonCommentObject()
        .then((obj) => {
          setObj(obj);
          LRUCache.set(__commentObjectCacheKey, obj);
        })
        .catch((err) => {
          LRUCache.delete(__commentObjectCacheKey);
          setError(`Course Lesson comment Object with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `Course Lesson comment Object with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [__commentObjectId, lesson]);

  useDeepCompareEffectNoCheck(() => {
    if (commentObject) {
      setObj(commentObject);
      LRUCache.set(__commentObjectCacheKey, obj);
    }
  }, [commentObject]);

  return {obj, setObj, error};
}
