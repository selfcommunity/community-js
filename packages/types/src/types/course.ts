import {SCUserType} from './user';
import {SCCategoryType} from './category';

/**
 * SCCoursePrivacyType enum
 */
export enum SCCoursePrivacyType {
  OPEN = 'open',
  PRIVATE = 'private',
  SECRET = 'secret',
  DRAFT = ''
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
  MANAGER = 'manager',
  CREATOR = 'creator'
}

/**
 * Interface SCCourseType.
 * Course Schema.
 */
export interface SCCourseType {
  /**
   * The ID of the course.
   */
  id?: number;
  /**
   * The name of the course.
   */
  name?: string;
  /**
   * The slug for the course.
   */
  slug?: string;
  /**
   * The description of the course.
   */
  description?: string;
  /**
   * The course type
   */
  type?: SCCourseTypologyType;
  /**
   * The course privacy.
   */
  privacy?: SCCoursePrivacyType;
  /**
   * The lesson order enforcement
   */
  enforce_lessons_order?: boolean;
  /**
   * Notifies course admins about new lesson comments
   */
  new_comment_notification_enabled?: boolean;
  /**
   * Hide member count (default: false).
   * If enabled, only managers can see the member count
   */
  hide_member_count?: boolean;
  /**
   * The course meta title
   */
  meta_title?: string;
  /**
   * The course meta description
   */
  meta_description?: string;
  /**
   * The course Open Graph title
   */
  og_title?: string;
  /**
   * The course Open Graph description
   */
  og_description?: string;
  /**
   * The course Open Graph image
   */
  og_image?: string;
  /**
   * The list of all section IDs belonging to the current course
   */
  sections_order?: number[];
  /**
   * The course image, original format.
   */
  image_original?: string;
  /**
   * The course image, bigger format.
   */
  image_bigger?: string;
  /**
   * The course image, big format.
   */
  image_big?: string;
  /**
   * The course image, medium format.
   */
  image_medium?: string;
  /**
   * The course image, small format.
   */
  image_small?: string;
  /**
   * The course subscription status.
   */
  join_status?: SCCourseJoinStatusType;
  /**
   * The course creation date.
   */
  created_at?: string;
  /**
   * The course creator.
   */
  created_by?: SCUserType;
  /**
   * The categories list ids
   */
  categories?: SCCategoryType[];
  /**
   * The course sections
   */
  sections?: SCCourseSectionType[] | any;
  /**
   * 	Total number of published lessons of the course
   */
  num_lessons?: number;
  /**
   * Total number of sections with at least one lesson
   */
  num_sections?: number;
  /**
   * Number of lessons completed by the user
   */
  num_lessons_completed?: number;
  /**
   * User completion rate of the course (percentage)
   */
  user_completion_rate?: number;
}

/**
 * Interface SCCourseCommentType.
 * Course Comment Schema.
 */
export interface SCCourseCommentType {
  /**
   * The unique integer value identifying this comment on a specific course
   */
  id: number;
  /**
   * The comment text.
   * @default empty string.
   * Only available when creating or updating a comment
   */
  text: string;
  /**
   * The comment text.
   * Only available when getting a comment
   */
  html: string;
  /**
   * The Id of the parent comment
   */
  parent: number;
  /**
   * The Id of the reply comment.
   * It must have the same parent
   */
  in_reply_to: number;
  /**
   * Datetime of comment creation
   */
  created_at: string;
  /**
   * The comment creator
   */
  created_by: SCUserType;
  /**
   * List of id of Media for this comment
   */
  medias: number[];
  /**
   * The last comment in reply to (with parent) this comment.
   * Not available if replies are presents.
   */
  latest_reply: SCCourseCommentType | null;
  /**
   * The list of comments in reply to (with parent) this comment.
   * Not available if latest_reply are presents.
   * Only available on the route: Get Course Comments
   */
  replies: SCCourseCommentType[];
  /**
   * Some extra useful data for the call that retrieves all the comments received within the entire course.
   * Only available on the route: Get Course Comments
   */
  extras: {
    /**
     * The course object associated to this comment
     */
    course: {
      id: number;
      slug: string;
    };
    /**
     * The section object associated to this comment
     */
    section: {
      id: number;
      name: string;
    };
    /**
     * The lesson object associated to this comment
     */
    lesson: {
      id: number;
      name: string;
    };
  };
}

/**
 * Interface SCCourseSectionType.
 * Course Schema.
 */
export interface SCCourseSectionType {
  /**
   * The ID of the course section.
   */
  id?: number;
  /**
   * The name of the section course
   */
  name?: string;
  /**
   * Sections are dripped relative to this date; used only id course type is scheduled
   */
  dripped_at?: Date | string;
  /**
   * Sections are dripped relative to the enrollment date of the current user; used only if the course type is structured .
   */
  drip_delay?: number;
  /**
   * The list of all lesson IDs belonging to the current section course
   */
  lessons_order?: number[];
  /**
   * The lessons associated to the course section
   */
  lessons?: SCCourseLessonType[];
  /**
   * Determines when the current section will be available for the user.
   * The value will be null if the course type is self-paced
   */
  available_date?: string;
  /**
   * Determines whether the current section is locked for the user based on the section availability strategy.
   * The value will not be considered if the course type is self-paced
   */
  locked?: boolean;
  /**
   * Total number of published lessons of the current course section
   */
  num_lessons?: number;
  /**
   * Number of lessons completed by the user in the current course section
   */
  num_lessons_completed?: number;
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
 * SCCourseLessonCompletionStatusType enum
 */
export enum SCCourseLessonCompletionStatusType {
  UNCOMPLETED = 'uncompleted',
  COMPLETED = 'completed',
  FAILED = 'failed'
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
   * The ID of the course the lesson belongs to.
   */
  course_id: number;
  /**
   * The ID of the section within the course the lesson belongs to,
   */
  section_id: number;
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
  /**
   * Determines whether the current lesson is locked for the user based on the user and on the course property: type and enforce_lessons_order
   */
  locked?: boolean;
  /**
   * Enum to define the course lesson completion status for the user
   */
  completion_status?: SCCourseLessonCompletionStatusType;
}
