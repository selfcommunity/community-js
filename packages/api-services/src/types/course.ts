/**
 * CourseCreateParams interface
 */
import {SCCourseDateFilterType, SCCoursePrivacyType, SCCourseRecurrenceType, SCCourseSubscriptionStatusType} from '@selfcommunity/types';
import {BaseGetParams, BaseSearchParams} from './baseParams';

export interface CourseCreateParams {
  /**
   * A unique name for the course
   */
  name: string;
  /**
   * The course privacy
   */
  privacy: SCCoursePrivacyType;
  /**
   * The course visibility. It is required when privacy = private.
   */
  visible?: boolean;
  /**
   * The course description
   */
  description?: string;
  /**
   * The course starting date and time
   */
  start_date: string;
  /**
   * The course ending date and time
   */
  end_date?: string;
  /**
   * The users to invite to the course
   */
  invite_users?: number[];
  /**
   * The course image
   */
  image_original?: File;
  /**
   * The course exact point
   */
  geolocation: string;
  /**
   * The course latitude
   */
  geolocation_lat: number;
  /**
   * The course longitude
   */
  geolocation_lng: number;
  /**
   * The course recurrency
   */
  recurring?: SCCourseRecurrenceType;
}

/**
 * CourseFeedParams interface.
 */
export interface CourseFeedParams extends BaseGetParams {
  /**
   * Which field to use when ordering the results.
   */
  ordering?: string;
}

/**
 * CourseRelatedParams interface.
 */
export interface CourseRelatedParams extends BaseGetParams {
  /**
   * Filter results by created_by user id.
   */
  created_by?: number;
}

/**
 * CourseUserParams interface.
 */
export interface CourseUserParams extends BaseGetParams {
  /**
   * Filter results by subscription_status
   */
  subscription_status?: SCCourseSubscriptionStatusType;
  /**
   *  Filtered past events
   */
  past?: boolean | number;
}

/**
 * CourseFeedParams interface.
 */
export interface CourseSearchParams extends BaseSearchParams {
  /**
   * The events filtered by a specific time frame
   */
  date_filter?: SCCourseDateFilterType;
  /**
   * The events created or followed by the users followed
   */
  follows?: boolean | number;
  /**
   * Filtered past events
   */
  past?: boolean | number;
}
