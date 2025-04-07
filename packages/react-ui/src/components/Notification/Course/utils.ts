import {SCCourseEditTabType} from '../../../types/course';
import {SCNotificationCourseActivityType, SCNotificationTypologyType} from '@selfcommunity/types';
import {SCRoutes} from '@selfcommunity/react-core';

function formatLessonUrl(notificationObject: SCNotificationCourseActivityType): any {
  return {
    id: notificationObject.course.id,
    slug: notificationObject.course.slug,
    section_id: notificationObject.comment.section_id,
    lesson_id: notificationObject.comment.lesson_id
  };
}

function formatCourseRequestsUrl(notificationObject: SCNotificationCourseActivityType): any {
  return {
    id: notificationObject.course.id,
    slug: notificationObject.course.slug,
    tab: SCCourseEditTabType.REQUESTS
  };
}

const getRouteName = (notificationObject: SCNotificationCourseActivityType) => {
  switch (notificationObject.type) {
    case SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON:
      return SCRoutes.COURSE_LESSON_COMMENTS_ROUTE_NAME;
    case SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_COURSE:
      return SCRoutes.COURSE_EDIT_ROUTE_NAME;
    default:
      return SCRoutes.COURSE_ROUTE_NAME;
  }
};

const getRouteParams = (notificationObject: SCNotificationCourseActivityType) => {
  switch (notificationObject.type) {
    case SCNotificationTypologyType.USER_COMMENTED_A_COURSE_LESSON:
      return formatLessonUrl(notificationObject);
    case SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_COURSE:
      return formatCourseRequestsUrl(notificationObject);
    default:
      return notificationObject.course;
  }
};

export {getRouteName, getRouteParams, formatLessonUrl};
