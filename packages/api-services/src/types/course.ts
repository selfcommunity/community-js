/**
 * CourseCreateParams interface
 */
import {SCCoursePrivacyType, SCCourseJoinStatusType, SCCourseTypologyType} from '@selfcommunity/types';
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
   * Filter results by subscription_status
   */
  join_status?: SCCourseJoinStatusType;
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
