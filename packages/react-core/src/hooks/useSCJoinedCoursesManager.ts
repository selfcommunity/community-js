import {useEffect, useMemo, useRef} from 'react';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCFeatureName,
  SCCoursePrivacyType,
  SCCourseJoinStatusType,
  SCCourseType,
  SCNotificationTopicType,
  SCNotificationTypologyType,
  SCUserType,
} from '@selfcommunity/types';
import useSCCachingManager from './useSCCachingManager';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import {SCNotificationMapping} from '../constants/Notification';
import {CONFIGURATIONS_COURSES_ENABLED} from '../constants/Preferences';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import PubSub from 'pubsub-js';

/**
 :::info
 This custom hook is used to manage the courses followed.
 :::

 :::tip How to use it:
 Follow these steps:
 ```jsx
 1. const scUserContext: SCUserContextType = useSCUser();
 2. const scJoinedCoursesManager: SCJoinedCoursesManagerType = scUserContext.manager.courses;
 3. scJoinedCoursesManager.isJoined(course)
 ```
 :::
 */
export default function useSCJoinedCoursesManager(user?: SCUserType) {
  const {cache, updateCache, emptyCache, data, setData, loading, setLoading, setUnLoading, isLoading} = useSCCachingManager();
  const {preferences, features} = useSCPreferences();
  const authUserId = user ? user.id : null;
  const coursesEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.COURSE) &&
      CONFIGURATIONS_COURSES_ENABLED in preferences &&
      preferences[CONFIGURATIONS_COURSES_ENABLED].value,
    [preferences, features]
  );

  const notificationInvitedToJoinCourse = useRef(null);
  const notificationRequestedToJoinCourse = useRef(null);
  const notificationAcceptedToJoinCourse = useRef(null);
  const notificationAddedToCourse = useRef(null);

  /**
   * Subscribe to notification types user_follow, user_unfollow
   */
  useDeepCompareEffectNoCheck(() => {
    notificationInvitedToJoinCourse.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_INVITED_TO_JOIN_COURSE}`,
      notificationSubscriber
    );
    notificationRequestedToJoinCourse.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_COURSE}`,
      notificationSubscriber
    );
    notificationAcceptedToJoinCourse.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_COURSE}`,
      notificationSubscriber
    );
    notificationAddedToCourse.current = PubSub.subscribe(
      `${SCNotificationTopicType.INTERACTION}.${SCNotificationTypologyType.USER_ADDED_TO_COURSE}`,
      notificationSubscriber
    );
    return () => {
      PubSub.unsubscribe(notificationInvitedToJoinCourse.current);
      PubSub.unsubscribe(notificationRequestedToJoinCourse.current);
      PubSub.unsubscribe(notificationAcceptedToJoinCourse.current);
      PubSub.unsubscribe(notificationAddedToCourse.current);
    };
  }, [data]);

  /**
   * Notification subscriber handler
   * @param msg
   * @param dataMsg
   */
  const notificationSubscriber = (msg, dataMsg) => {
    if (dataMsg.data.course !== undefined) {
      let _status: string;
      switch (SCNotificationMapping[dataMsg.data.activity_type]) {
        case SCNotificationTypologyType.USER_INVITED_TO_JOIN_COURSE:
          _status = SCCourseJoinStatusType.INVITED;
          break;
        case SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_COURSE:
          _status = SCCourseJoinStatusType.REQUESTED;
          break;
        case SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_COURSE:
          _status = SCCourseJoinStatusType.JOINED;
          break;
        case SCNotificationTypologyType.USER_ADDED_TO_COURSE:
          _status = SCCourseJoinStatusType.JOINED;
          break;
      }
      updateCache([dataMsg.data.course]);
      setData((prev) => getDataUpdated(prev, dataMsg.data.course, _status));
    }
  };
  /**
   * Memoized refresh all courses
   * It makes a single request to the server and retrieves
   * all the courses followed by the user in a single solution
   * It might be useful for multi-tab sync
   */
  const refresh = useMemo(
    () => (): void => {
      emptyCache();
      if (user) {
        // Only if user is authenticated
        http
          .request({
            url: Endpoints.GetUserJoinedCourses.url({id: user.id}),
            method: Endpoints.GetUserJoinedCourses.method,
          })
          .then((res: HttpResponse<any>) => {
            if (res.status >= 300) {
              return Promise.reject(res);
            }
            const coursesIds = res.data.results.map((c: SCCourseType) => c.id);
            updateCache(coursesIds);
            setData(res.data.results.map((c: SCCourseType) => ({[c.id]: c.join_status})));
            return Promise.resolve(res.data);
          })
          .catch((e) => {
            Logger.error(SCOPE_SC_CORE, 'Unable to refresh the authenticated user courses.');
            Logger.error(SCOPE_SC_CORE, e);
          });
      }
    },
    [data, user, cache]
  );

  /**
   * Memoized join Course
   * Toggle action
   */
  const join = useMemo(
    () =>
      (course: SCCourseType, userId?: number): Promise<any> => {
        setLoading(course.id);
        if (userId) {
          return http
            .request({
              url: Endpoints.InviteOrAcceptUsersToCourse.url({id: course.id}),
              method: Endpoints.InviteOrAcceptUsersToCourse.method,
              data: {users: [userId]},
            })
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([course.id]);
              setData((prev) => getDataUpdated(prev, course.id, SCCourseJoinStatusType.JOINED));
              setUnLoading(course.id);
              return Promise.resolve(res.data);
            });
        } else {
          return http
            .request({
              url: Endpoints.JoinOrAcceptInviteToCourse.url({id: course.id}),
              method: Endpoints.JoinOrAcceptInviteToCourse.method,
            })
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([course.id]);
              setData((prev) =>
                getDataUpdated(
                  prev,
                  course.id,
                  course.privacy === SCCoursePrivacyType.PRIVATE && course.join_status !== SCCourseJoinStatusType.INVITED
                    ? SCCourseJoinStatusType.REQUESTED
                    : SCCourseJoinStatusType.JOINED
                )
              );
              setUnLoading(course.id);
              return Promise.resolve(res.data);
            });
        }
      },
    [data, loading, cache]
  );

  /**
   * Memoized leave Course
   * Toggle action
   */
  const leave = useMemo(
    () =>
      (course: SCCourseType): Promise<any> => {
        if (course.join_status !== SCCourseJoinStatusType.REQUESTED) {
          setLoading(course.id);
          return http
            .request({
              url: Endpoints.LeaveOrRemoveCourseRequest.url({id: course.id}),
              method: Endpoints.LeaveOrRemoveCourseRequest.method,
            })
            .then((res: HttpResponse<any>) => {
              if (res.status >= 300) {
                return Promise.reject(res);
              }
              updateCache([course.id]);
              setData((prev) => getDataUpdated(prev, course.id, null));
              setUnLoading(course.id);
              return Promise.resolve(res.data);
            });
        }
      },
    [data, loading, cache]
  );

  /**
   * Check the authenticated user subscription status to the course
   * Update the courses cached
   * Update courses subscription statuses
   * @param course
   */
  const checkCourseJoinedStatus = (course: SCCourseType): Promise<any> => {
    setLoading(course.id);
    return http
      .request({
        url: Endpoints.GetCourseStatus.url({id: course.id}),
        method: Endpoints.GetCourseStatus.method,
      })
      .then((res: HttpResponse<any>) => {
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        setData((prev) => getDataUpdated(prev, course.id, res.data.status));
        updateCache([course.id]);
        setUnLoading(course.id);
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        setUnLoading(course.id);
        return Promise.reject(e);
      });
  };

  /**
   * Get updated data
   * @param data
   * @param courseId
   * @param joinStatus
   */
  const getDataUpdated = (data, courseId, joinStatus) => {
    const _index = data.findIndex((k) => parseInt(Object.keys(k)[0]) === courseId);
    let _data;
    if (_index < 0) {
      _data = [...data, ...[{[courseId]: joinStatus}]];
    } else {
      _data = data.map((k, i) => {
        if (parseInt(Object.keys(k)[0]) === courseId) {
          return {[Object.keys(k)[0]]: joinStatus};
        }
        return {[Object.keys(k)[0]]: data[i][Object.keys(k)[0]]};
      });
    }
    return _data;
  };

  /**
   * Return current course subscription status if exists,
   * otherwise return null
   */
  const getCurrentCourseCacheStatus = useMemo(
    () =>
      (course: SCCourseType): string => {
        const d = data.filter((k) => parseInt(Object.keys(k)[0]) === course.id);
        return d.length ? d[0][course.id] : !data.length ? course.join_status : null;
      },
    [data]
  );

  /**
   * Bypass remote check if the course is subscribed
   */
  const getJoinStatus = useMemo(
    () => (course: SCCourseType) => {
      updateCache([course.id]);
      setData((prev) => getDataUpdated(prev, course.id, course.join_status));
      return course.join_status;
    },
    [data, cache]
  );

  /**
   * Memoized joinStatus
   * If the course is already in cache -> check if the course is in courses,
   * otherwise, check if user joined the course
   */
  const joinStatus = useMemo(
    () =>
      (course: SCCourseType): string => {
        // Cache is valid also for anonymous user
        if (cache.includes(course.id)) {
          return getCurrentCourseCacheStatus(course);
        }
        if (authUserId) {
          if ('join_status' in course) {
            return getJoinStatus(course);
          }
          if (!isLoading(course)) {
            checkCourseJoinedStatus(course);
          }
        }
        return null;
      },
    [loading, cache, authUserId]
  );

  /**
   * Empty cache on logout
   */
  useEffect(() => {
    if (!authUserId) {
      emptyCache();
    }
  }, [authUserId]);

  if (!coursesEnabled || !user) {
    return {courses: data, loading, isLoading};
  }
  return {courses: data, loading, isLoading, join, leave, joinStatus, refresh, emptyCache};
}
