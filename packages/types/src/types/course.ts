import {SCUserType} from './user';

/**
 * SCCoursePrivacyType enum
 */
export enum SCCoursePrivacyType {
  OPEN = 'open',
  PRIVATE = 'private',
  SECRET = 'secret'
}

/**
 * SCCourseTypologyType enum
 */
export enum SCCourseTypologyType {
  SELF = 'self-paced',
  SCHEDULED = 'scheduled',
  STRUCTURED = 'structured'
}

/**
 * SCGroupSubscriptionStatusType enum
 */
export enum SCCourseJoinStatusType {
  JOINED = 'joined',
  REQUESTED = 'requested',
  INVITED = 'invited',
  MANAGER = 'manager'
}

/**
 * Interface SCGroupCourseType.
 * Course Schema.
 */
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
   * The slug for the course.
   */
  slug: string;
  /**
   * The description of the course.
   */
  description: string;
  /**
   * The course type
   */
  type: SCCourseTypologyType;
  /**
   * The course privacy.
   */
  privacy: SCCoursePrivacyType;
  /**
   * The lesson order enforcement
   */
  enforce_lessons_order?: boolean;
  /**
   * Notifies course admins about new lesson comments
   */
  new_comment_notification_enabled?: boolean;
  /**
   * The list of all section IDs belonging to the current course
   */
  sections_order?: number[];
  /**
   * The course image, original format.
   */
  image_original: string;
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
   * The course subscription status.
   */
  join_status: SCCourseJoinStatusType;
  /**
   * The course creation date.
   */
  created_at: string;
  /**
   * The course creator.
   */
  created_by: SCUserType;
  /**
   * The course sections
   */
  sections?: SCCourseSectionType[] | any;
  /**
   * The categories list ids
   */
  categories?: number[];
}
/**
 * Interface SCCourseSectionType.
 * Course Schema.
 */
export interface SCCourseSectionType {
  /**
   * The ID of the course section.
   */
  id: number;
  /**
   * The name of the section course
   */
  name: string;
  /**
   * Sections are dripped relative to this date; used only id course type is scheduled
   */
  dripped_at: string;
  /**
   * Sections are dripped relative to the enrollment date of the current user; used only if the course type is structured .
   */
  drip_delay: number;
  /**
   * The list of all lesson IDs belonging to the current section course
   */
  lessons_order: number[];
  /**
   * The lessons associated to the course section
   */
  lessons: SCCourseLessonType[];
}

/**
 * SCCourseLessonTypologyType enum
 */
export enum SCCourseLessonTypologyType {
  LESSON = 'lesson',
  QUIZ = 'quiz'
}

/**
 * SCCourseLessonStatusType enum
 */
export enum SCCourseLessonStatusType {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

/**
 * Interface SCCourseLessonType.
 * Course Schema.
 */
export interface SCCourseLessonType {
  /**
   * The ID of the lesson.
   */
  id: number;
  /**
   * The name of the lesson
   */
  name: string;
  /**
   * The type of the lesson.
   */
  type?: SCCourseLessonTypologyType;
  /**
   * The status of the lesson.
   */
  status?: SCCourseLessonStatusType;
  /**
   * Enable the comments on the current lesson.
   */
  comments_enabled?: boolean;
  /**
   * The lesson course text.
   */
  text?: string;
  /**
   * The lesson course html.
   */
  html?: string;
  /**
   * Datetime of lesson course creation.
   */
  created_at?: string;
  /**
   * The lesson course creator.
   */
  created_by?: SCUserType;
  /**
   * The list of Media ids for the lesson course
   */
  medias?: number[];
  completed?: boolean;
}
