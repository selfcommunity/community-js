/**
 * CourseCreateParams interface
 */
import {SCCoursePrivacyType, SCCourseJoinStatusType, SCCourseTypologyType, SCCourseOrderingUsersType} from '@selfcommunity/types';
import {BaseGetParams, BaseSearchParams} from './baseParams';

export interface CourseCreateParams {
  /**
   * A unique name for the course
   */
  name: string;
  /**
   * The course description
   */
  description?: string;
  /**
   * The course type
   */
  type: SCCourseTypologyType;
  /**
   * The course privacy
   */
  privacy: SCCoursePrivacyType;
  /**
   * The categories id
   */
  categories: number[];
}

export interface CourseSectionParams {
  /**
   * A unique name for the course section
   */
  name: string;
}

/**
 * CourseUserParams interface.
 */
export interface CourseUserParams extends BaseGetParams {
  /**
   * Return only courses created by this user id
   */
  created_by?: number;
  /**
   *  Filter by join_status; default: ["manager", "joined"]
   */
  statuses?: SCCourseJoinStatusType[] | SCCourseJoinStatusType;
}

/**
 * CourseSearchParams interface.
 */
export interface CourseSearchParams extends BaseSearchParams {
  /**
   * The categories ids
   */
  categories?: number[];
}

/**
 * CourseInfoView enum
 */
export enum CourseInfoViewType {
  USER = 'user',
  EDIT = 'edit',
  DASHBOARD = 'dashboard'
}

/**
 * CourseInfoParams interface.
 */
export interface CourseInfoParams {
  view?: CourseInfoViewType;
  user?: number;
}

/**
 * CourseLessonCommentsParams interface.
 */
export interface CourseLessonCommentsParams extends BaseGetParams {
  /**
   * The ordering of the comments; use - for order desc.
   * Default to created_at
   */
  ordering?: string;
  /**
   * The Id of the parent Course Comment; used for retrieve nested comments
   */
  parent?: string;
}

/**
 * CourseUserRoleParams interface.
 */
export interface CourseUserRoleParams {
  /**
   * List of id of User to set as managers role.
   * At least one parameter between managers, joined and unjoined is required.
   */
  managers?: number[];
  /**
   * List of id of User to force to join the course as normal users.
   * At least one parameter between managers, joined and unjoined is required.
   */
  joined?: number[];
  /**
   * List of id of User to force to unjoin the course.
   * At least one parameter between managers, joined and unjoined is required.
   */
  unjoined?: number[];
}

/**
 * CourseUsersParams interface.
 */
export interface CourseUsersParams extends BaseGetParams {
  /**
   * Filter by join_status; default: ["manager", "joined"].
   * Only creator, manager and joined are valid status for this route
   */
  statuses?: SCCourseJoinStatusType[] | SCCourseJoinStatusType;
}

/**
 * CourseDashboardUsersParams interface.
 */
export interface CourseDashboardUsersParams extends BaseSearchParams {
  /**
   *  Filter by join_status; default: ["manager", "joined"]
   */
  statuses?: SCCourseJoinStatusType[];
  /**
   * The order of the users. Default to -joined_at
   */
  ordering?: SCCourseOrderingUsersType;
}
