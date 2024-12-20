/**
 * Interface SCGroupCourseType.
 * Course Schema.
 */
import {SCUserType} from './user';
import { SCCategoryType } from './category';

/**
 * SCCoursePrivacyType enum
 */
export enum SCCoursePrivacyType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SECRET = 'secret'
}

/**
 * SCCourseTypologyType enum
 */
export enum SCCourseTypologyType {
  SELF = 'self',
  CALENDARIZED = 'calendarized',
  PROGRAMMED = 'programmed'
}

/**
 * SCGroupSubscriptionStatusType enum
 */
export enum SCCourseSubscriptionStatusType {
  SUBSCRIBED = 'subscribed',
  REQUESTED = 'requested',
  INVITED = 'invited',
  GOING = 'going',
  NOT_GOING = 'not_going'
}

/**
 * SCCourseStatusType enum
 */
export enum SCCourseStatusType {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

/**
 * SCCourseLocationType enum
 */
export enum SCCourseLocationType {
  PERSON = 'in person',
  ONLINE = 'virtual'
}

/**
 * SCCourseLocationFilterType enum
 */
export enum SCCourseLocationFilterType {
  ANY = 'any',
  PERSON = 'in person',
  ONLINE = 'virtual'
}

/**
 * SCCourseRecurrenceType enum
 */
export enum SCCourseRecurrenceType {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

/**
 * SCCourseRecurrenceType enum
 */
export enum SCCourseDateFilterType {
  ANY = 'any',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month',
  PAST = 'past'
}

export interface SCCourseType {
  /**
   * The ID of the course.
   */
  id: number;

  /**
   * The name of the course.
   */
  name: string;

  /**
   * The description of the course.
   */
  description: string;

  /**
   * The slug for the course.
   */
  slug: string;

  /**
   * The color of the course.
   */
  color: string;

  /**
   * The course privacy.
   */
  privacy: SCCoursePrivacyType;

  /**
   * The course visibility.
   */
  visible: boolean;

  /**
   * The course active status.
   */
  active: boolean;

  /**
   * If the course is showed in the feed.
   */
  show_on_feed: boolean;

  /**
   * The course subscription status.
   */
  subscription_status: SCCourseSubscriptionStatusType;

  /**
   * The course image, bigger format.
   */
  image_bigger: string;

  /**
   * The course image, big format.
   */
  image_big: string;

  /**
   * The course image, medium format.
   */
  image_medium: string;

  /**
   * The course image, small format.
   */
  image_small: string;

  /**
   * The number of course members
   */
  subscribers_counter: number;

  /**
   * The number of participating members
   */
  goings_counter: number;

  /**
   * The course start date.
   */
  start_date: string;

  /**
   * The course end date.
   */
  end_date: string | null;

  /**
   * If the course is currently running
   */
  running: boolean;

  /**
   *  The start date and time when the course running period began.
   */
  running_start_date: string;

  /**
   * The expected or actual end date and time for the course running period.
   */
  running_end_date: string;

  /**
   *  The start date  when the next course running period is scheduled to begin (for recurrent events).
   */
  next_start_date: string;

  /**
   * The end date for the next course running period (for recurrent events).
   */
  next_end_date: string;

  /**
   * The course recurrence
   */
  recurring: SCCourseRecurrenceType;

  /**
   * The course location (in person, online)
   */
  location: SCCourseLocationType;

  /**
   * The course place
   */
  geolocation: string | null;

  /**
   * The course latitude
   */
  geolocation_lat: number | null;

  /**
   * The course longitude
   */
  geolocation_lng: number | null;

  /**
   * The course link(if virtual)
   */

  link: string | null;

  /**
   * The course creation date.
   */
  created_at: string;

  /**
   * The course creator.
   */
  created_by: SCUserType;

  /**
   * The course admin.
   */
  managed_by: SCUserType;

  /**
   * The course type
   */
  type: SCCourseTypologyType;

  /**
   * The category id
   */
  category?: number;
}
