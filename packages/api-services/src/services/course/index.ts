import {SCCourseCommentType, SCCourseLessonType, SCCourseSectionType, SCCourseType, SCUserType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import Endpoints from '../../constants/Endpoints';
import {
  BaseGetParams,
  BaseSearchParams,
  CourseCreateParams,
  CourseDashboardUsersParams,
  CourseInfoParams,
  CourseLessonCommentsParams,
  CourseSearchParams,
  CourseUserRoleParams,
  CourseUsersParams,
  SCPaginatedResponse
} from '../../types';
import {CourseSectionParams, CourseUserParams} from '../../types/course';
import {apiRequest} from '../../utils/apiRequest';
import {urlParams} from '../../utils/url';

export interface CourseApiClientInterface {
  //Allows user managers to change the role of some users for the course identified with :id
  changeCourseUserRole(id: number | string, data: CourseUserRoleParams, config?: AxiosRequestConfig): Promise<any>;

  // Courses subscribed to by the user
  getJoinedCourses(params?: CourseUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Courses subscribed by the user identified with :id in the path params (for the rest it is the same as getUserCourses)
  getUserJoinedCourses(id: number | string, params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Courses search
  searchCourses(params?: CourseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Course detail
  getSpecificCourseInfo(id: number | string, params?: CourseInfoParams, config?: AxiosRequestConfig): Promise<SCCourseType>;

  // Course dashboard users
  getCourseDashboardUsers(
    id: number | string,
    params?: CourseDashboardUsersParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;

  // Courses CRUD
  createCourse(data: CourseCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCCourseType>;
  updateCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType>;
  patchCourse(id: number | string, data: Partial<SCCourseType>, config?: AxiosRequestConfig): Promise<SCCourseType>;
  deleteCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Course Comments CRUD
  getCourseLessonComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType>;
  getCourseComments(id: number | string, course_id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseCommentType>>;
  createCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseCommentType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType>;
  updateCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    data: SCCourseCommentType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType>;
  patchCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType>;
  deleteCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any>;

  // Courses section CRUD
  getCourseSection(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<SCCourseSectionType>;
  getCourseSections(id: number | string, config?: AxiosRequestConfig): Promise<SCCourseSectionType[]>;
  createCourseSection(id: number | string, data: CourseSectionParams, config?: AxiosRequestConfig): Promise<SCCourseSectionType>;
  updateCourseSection(
    id: number | string,
    section_id: number | string,
    data: SCCourseSectionType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseSectionType>;
  patchCourseSection(
    id: number | string,
    section_id: number | string,
    data: SCCourseSectionType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseSectionType>;
  deleteCourseSection(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Courses lessons CRUD
  getCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType>;
  getCourseLessonComments(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    params?: CourseLessonCommentsParams,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType[]>;
  getCourseLessons(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<SCCourseLessonType[]>;
  createCourseLesson(data: SCCourseLessonType, config?: AxiosRequestConfig): Promise<SCCourseLessonType>;
  updateCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType>;
  patchCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: Partial<SCCourseLessonType>,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType>;
  deleteCourseLesson(id: number | string, section_id: number | string, lesson_id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Course Lesson mark complete/incomplete
  markLessonComplete(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<any>;
  markLessonInComplete(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<any>;

  // Course image change (bigger, big, medium, small)
  changeCourseCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCCourseType>;

  // Users awaiting approval subscribers
  getCourseWaitingApproval(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Given an already existing course, it suggests users to invite
  getCourseSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users invited to the course
  getCourseInvitedUsers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users who joined to the course
  getCourseJoinedUsers(id: number | string, params?: CourseUsersParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Subscribe/Unsubscribe
  joinOrAcceptInviteToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  leaveOrRemoveCourseRequest(id: number | string, data?: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // To invite a user or to accept a request to participate in the course (in the end the user is ONLY subscribed to the course)
  // To request participation in a private course use joinOrAcceptInviteToCourse which automatically manages the subscription to a private/public course
  inviteOrAcceptUsersToCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // Remove invites - only for course moderator or user authenticated
  removeInvitationToCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // Course subscription status
  getCourseStatus(id: number | string, config?: AxiosRequestConfig): Promise<any>;
}
/**
 * Contains all the endpoints needed to manage events.
 */
export class CourseApiClient {
  /**
   * This endpoint allows user managers to change the role of some users in the specified course.
   * @param _id
   * @param data
   * @param config
   */
  static changeCourseUserRole(id: number | string, data: CourseUserRoleParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.ChangeCourseUserRole.url({id}), method: Endpoints.ChangeCourseUserRole.method, data});
  }
  /**
   * This endpoint retrieves all the events of the logged-in user.
   * @param params
   * @param config
   */
  static getJoinedCourses(params?: CourseUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetJoinedCourses.url({})}?${p.toString()}`, method: Endpoints.GetJoinedCourses.method});
  }
  /**
   * This endpoint retrieves a specific course.
   * @param id
   * @param config
   */
  static getUserJoinedCourses(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return apiRequest({...config, url: Endpoints.GetUserJoinedCourses.url({id}), method: Endpoints.GetUserJoinedCourses.method});
  }
  /**
   * This endpoint performs events search
   * @param params
   * @param config
   */
  static searchCourses(params?: CourseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return apiRequest({...config, params, url: Endpoints.SearchCourses.url({}), method: Endpoints.SearchCourses.method});
  }

  /**
   * This endpoint retrieves a specific course.
   * @param id
   * @param params
   * @param config
   */
  static getSpecificCourseInfo(id: number | string, params?: CourseInfoParams, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, params, url: Endpoints.GetCourseInfo.url({id}), method: Endpoints.GetCourseInfo.method});
  }

  /**
   * This endpoint retrieves the list of all users that joined the course identified by Id
   * it will also return some useful stats that can be used to make a course dashboard.
   * @param id
   * @param params
   * @param config
   */
  static getCourseDashboardUsers(
    id: number | string,
    params?: CourseDashboardUsersParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, params, url: Endpoints.GetCourseDashboardUsers.url({id}), method: Endpoints.GetCourseDashboardUsers.method});
  }

  /**
   * This endpoint creates a course.
   * @param data
   * @param config
   */
  static createCourse(data: CourseCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.CreateCourse.url({}), method: Endpoints.CreateCourse.method, data});
  }

  /**
   * This endpoint updates a course.
   * @param id
   * @param data
   * @param config
   */
  static updateCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.UpdateCourse.url({id}), method: Endpoints.UpdateCourse.method, data});
  }

  /**
   * This endpoint patches a  course.
   * @param id
   * @param data
   * @param config
   */
  static patchCourse(id: number | string, data: Partial<SCCourseType>, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.PatchCourse.url({id}), method: Endpoints.PatchCourse.method, data});
  }
  /**
   * This endpoint deletes a course.
   * @param id
   * @param config
   */
  static deleteCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteCourse.url({id}), method: Endpoints.DeleteCourse.method});
  }

  /**
   * This endpoint retrieves a specific course comment.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param comment_id
   * @param config
   */
  static getCourseLessonComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return apiRequest({
      ...config,
      url: Endpoints.GetCourseLessonComment.url({id, section_id, lesson_id, comment_id}),
      method: Endpoints.GetCourseLessonComment.method
    });
  }

  /**
   * This endpoint retrieves the course comments.
   * @param id
   * @param params
   * @param config
   */
  static getCourseComments(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCCourseCommentType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetCourseComments.url({id}),
      method: Endpoints.GetCourseComments.method,
      params
    });
  }

  /**
   * This endpoint creates a course comment.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param data
   * @param config
   */
  static createCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseCommentType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return apiRequest({
      ...config,
      url: Endpoints.CreateCourseComment.url({id, section_id, lesson_id}),
      method: Endpoints.CreateCourseComment.method,
      data
    });
  }

  /**
   * This endpoint updates a course comment.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param comment_id
   * @param data
   * @param config
   */
  static updateCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    data: SCCourseCommentType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return apiRequest({
      ...config,
      url: Endpoints.UpdateCourseComment.url({id, section_id, lesson_id, comment_id}),
      method: Endpoints.UpdateCourseComment.method,
      data
    });
  }

  /**
   * This endpoint patches a course comment.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param comment_id
   * @param data
   * @param config
   */
  static patchCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return apiRequest({
      ...config,
      url: Endpoints.PatchCourseComment.url({id, section_id, lesson_id, comment_id}),
      method: Endpoints.PatchCourseComment.method,
      data
    });
  }

  /**
   * This endpoint deletes a course comment.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param comment_id
   * @param config
   */
  static deleteCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.DeleteCourseComment.url({id, section_id, lesson_id, comment_id}),
      method: Endpoints.DeleteCourseComment.method
    });
  }

  /**
   * This endpoint retrieves a specific course section.
   * @param id
   * @param section_id
   * @param config
   */
  static getCourseSection(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<SCCourseSectionType> {
    return apiRequest({...config, url: Endpoints.GetCourseSection.url({id, section_id}), method: Endpoints.GetCourseSection.method});
  }

  /**
   * This endpoint retrieves the course sections.
   * @param id
   * @param config
   */
  static getCourseSections(id: number | string, config?: AxiosRequestConfig): Promise<SCCourseSectionType[]> {
    return apiRequest({...config, url: Endpoints.GetCourseSections.url({id}), method: Endpoints.GetCourseSections.method});
  }

  /**
   * This endpoint creates a course section.
   * @param data
   * @param config
   */
  static createCourseSection(id: number | string, data: CourseSectionParams, config?: AxiosRequestConfig): Promise<SCCourseSectionType> {
    return apiRequest({...config, url: Endpoints.CreateCourseSection.url({id}), method: Endpoints.CreateCourseSection.method, data});
  }

  /**
   * This endpoint updates a course section.
   * @param id
   * @param section_id
   * @param data
   * @param config
   */
  static updateCourseSection(
    id: number | string,
    section_id: number | string,
    data: SCCourseSectionType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseSectionType> {
    return apiRequest({
      ...config,
      url: Endpoints.UpdateCourseSection.url({id, section_id}),
      method: Endpoints.UpdateCourseSection.method,
      data
    });
  }

  /**
   * This endpoint patches a  course section.
   * @param id
   * @param section_id
   * @param data
   * @param config
   */
  static patchCourseSection(
    id: number | string,
    section_id: number | string,
    data: SCCourseSectionType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseSectionType> {
    return apiRequest({...config, url: Endpoints.PatchCourseSection.url({id, section_id}), method: Endpoints.PatchCourseSection.method, data});
  }
  /**
   * This endpoint deletes a course section.
   * @param id
   * @param section_id
   * @param config
   */
  static deleteCourseSection(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteCourseSection.url({id, section_id}), method: Endpoints.DeleteCourseSection.method});
  }

  /**
   * This endpoint retrieves a specific course lesson.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param config
   */
  static getCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType> {
    return apiRequest({...config, url: Endpoints.GetCourseLesson.url({id, section_id, lesson_id}), method: Endpoints.GetCourseLesson.method});
  }

  /**
   * This endpoint retrieves the comments for a specific course lesson.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param params
   * @param config
   */
  static getCourseLessonComments(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    params?: CourseLessonCommentsParams,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType[]> {
    return apiRequest({
      ...config,
      url: Endpoints.GetCourseLessonComments.url({id, section_id, lesson_id}),
      method: Endpoints.GetCourseLessonComments.method,
      params
    });
  }

  /**
   * This endpoint retrieves the course lessons.
   * @param id
   * @param section_id
   * @param config
   */
  static getCourseLessons(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<SCCourseLessonType[]> {
    return apiRequest({...config, url: Endpoints.GetCourseLessons.url({id, section_id}), method: Endpoints.GetCourseLessons.method});
  }

  /**
   * This endpoint creates a course lesson.
   * @param data
   * @param config
   */
  static createCourseLesson(data: SCCourseLessonType, config?: AxiosRequestConfig): Promise<SCCourseLessonType> {
    return apiRequest({...config, url: Endpoints.CreateCourseLesson.url({}), method: Endpoints.CreateCourseLesson.method, data});
  }

  /**
   * This endpoint updates a course lesson.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param data
   * @param config
   */
  static updateCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType> {
    return apiRequest({
      ...config,
      url: Endpoints.UpdateCourseLesson.url({id, section_id, lesson_id}),
      method: Endpoints.UpdateCourseLesson.method,
      data
    });
  }

  /**
   * This endpoint patches a  course lesson.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param data
   * @param config
   */
  static patchCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: Partial<SCCourseLessonType>,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType> {
    return apiRequest({
      ...config,
      url: Endpoints.PatchCourseLesson.url({id, section_id, lesson_id}),
      method: Endpoints.PatchCourseLesson.method,
      data
    });
  }
  /**
   * This endpoint deletes a course lesson.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param config
   */
  static deleteCourseLesson(id: number | string, section_id: number | string, lesson_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteCourseLesson.url({id, section_id, lesson_id}), method: Endpoints.DeleteCourseLesson.method});
  }

  /**
   * This endpoint marks a course lesson as complete.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param config
   */
  static markLessonComplete(id: number | string, section_id: number | string, lesson_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.MarkLessonComplete.url({id, section_id, lesson_id}), method: Endpoints.MarkLessonComplete.method});
  }

  /**
   * This endpoint marks a course lesson as incomplete.
   * @param id
   * @param section_id
   * @param lesson_id
   * @param config
   */
  static markLessonIncomplete(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.MarkLessonIncomplete.url({id, section_id, lesson_id}),
      method: Endpoints.MarkLessonIncomplete.method
    });
  }

  /**
   * This endpoint changes the course avatar
   * @param id
   * @param data
   * @param config
   */
  static changeCourseCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({url: Endpoints.PatchCourse.url({id}), method: Endpoints.PatchCourse.method, data, ...config});
  }

  /**
   * This endpoint returns all waiting approval subscribers
   * @param id
   * @param params
   * @param config
   */
  static getCourseWaitingApproval(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetCourseWaitingApproval.url({id})}?${p.toString()}`,
      method: Endpoints.GetCourseWaitingApproval.method
    });
  }
  /**
   * This endpoint returns a list of suggested users to invite to the course.
   * @param id
   * @param search
   * @param config
   */
  static getCourseSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetCourseSuggestedUsers.url({id, search}),
      method: Endpoints.GetCourseSuggestedUsers.method
    });
  }

  /**
   * This endpoint returns a list of invited users.
   * @param id
   * @param params
   * @param config
   */
  static getCourseInvitedUsers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetCourseInvitedUsers.url({id})}?${p.toString()}`,
      method: Endpoints.GetCourseInvitedUsers.method
    });
  }

  /**
   * This endpoint returns a list of joined users.
   * @param id
   * @param params
   * @param config
   */
  static getCourseJoinedUsers(
    id: number | string,
    params?: CourseUsersParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetCourseJoinedUsers.url({id})}?${p.toString()}`,
      method: Endpoints.GetCourseJoinedUsers.method
    });
  }

  /**
   * This endpoint subscribes to a course.
   * @param id
   * @param config
   */
  static joinOrAcceptInviteToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.JoinOrAcceptInviteToCourse.url({id}), method: Endpoints.JoinOrAcceptInviteToCourse.method});
  }

  /**
   * This endpoint unsubscribes from a course.
   * @param id
   * @param config
   */
  static leaveOrRemoveCourseRequest(id: number | string, data?: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.LeaveOrRemoveCourseRequest.url({id}),
      method: Endpoints.LeaveOrRemoveCourseRequest.method,
      data
    });
  }

  /**
   * This endpoint allows to invite or accept a course invite.
   * @param id
   * @param data
   * @param config
   */
  static inviteOrAcceptUsersToCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.InviteOrAcceptUsersToCourse.url({id}),
      method: Endpoints.InviteOrAcceptUsersToCourse.method,
      data
    });
  }
  /**
   * This endpoint allows to remove invites.
   * @param id
   * @param data
   * @param config
   */
  static removeInvitationToCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.RemoveInvitationToCourse.url({id}),
      method: Endpoints.RemoveInvitationToCourse.method,
      data
    });
  }
  /**
   * This endpoint retrieves the course subscription status.
   * @param id
   * @param config
   */
  static getCourseStatus(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.GetCourseStatus.url({id}), method: Endpoints.GetCourseStatus.method});
  }
}

/**
 *
 :::tip Incubator service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {CourseService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `searchCourses` will return the events matching the search query.

 async searchCourses() {
         return await CourseService.searchCourses();
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificCourseInfo(eventId) {
         return await CourseService.getSpecificCourseInfo(eventId);
       }
 ```
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class CourseService {
  static async changeCourseUserRole(id: number | string, data: CourseUserRoleParams, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.changeCourseUserRole(id, data, config);
  }
  static async getJoinedCourses(params?: CourseUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.getJoinedCourses(params, config);
  }
  static async getUserJoinedCourses(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.getUserJoinedCourses(id, config);
  }
  static async searchCourses(params?: CourseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.searchCourses(params, config);
  }
  static async getSpecificCourseInfo(id: number | string, params?: CourseInfoParams, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.getSpecificCourseInfo(id, params, config);
  }
  static async getCourseDashboardUsers(
    id: number | string,
    params?: CourseDashboardUsersParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseDashboardUsers(id, params, config);
  }
  static async createCourse(data: CourseCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.createCourse(data, config);
  }
  static async updateCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.updateCourse(id, data, config);
  }
  static async patchCourse(id: number | string, data: Partial<SCCourseType>, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.patchCourse(id, data, config);
  }
  static async deleteCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.deleteCourse(id, config);
  }
  static async getCourseLessonComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return CourseApiClient.getCourseLessonComment(id, section_id, lesson_id, comment_id, config);
  }

  static async getCourseComments(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCCourseCommentType>> {
    return CourseApiClient.getCourseComments(id, params, config);
  }

  static async createCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseCommentType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return CourseApiClient.createCourseComment(id, section_id, lesson_id, data, config);
  }

  static async updateCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    data: SCCourseCommentType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return CourseApiClient.updateCourseComment(id, section_id, lesson_id, comment_id, data, config);
  }

  static async patchCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType> {
    return CourseApiClient.patchCourseComment(id, section_id, lesson_id, comment_id, data, config);
  }

  static async deleteCourseComment(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    comment_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return CourseApiClient.deleteCourseComment(id, section_id, lesson_id, comment_id, config);
  }

  static async getCourseSection(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<SCCourseSectionType> {
    return CourseApiClient.getCourseSection(id, section_id, config);
  }
  static async getCourseSections(id: number | string, config?: AxiosRequestConfig): Promise<SCCourseSectionType[]> {
    return CourseApiClient.getCourseSections(id, config);
  }
  static async createCourseSection(id: number | string, data: CourseSectionParams, config?: AxiosRequestConfig): Promise<SCCourseSectionType> {
    return CourseApiClient.createCourseSection(id, data, config);
  }
  static async updateCourseSection(
    id: number | string,
    section_id: number | string,
    data: SCCourseSectionType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseSectionType> {
    return CourseApiClient.updateCourseSection(id, section_id, data, config);
  }
  static async patchCourseSection(
    id: number | string,
    section_id: number | string,
    data: SCCourseSectionType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseSectionType> {
    return CourseApiClient.patchCourseSection(id, section_id, data, config);
  }
  static async deleteCourseSection(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.deleteCourseSection(id, section_id, config);
  }
  static async getCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType> {
    return CourseApiClient.getCourseLesson(id, section_id, lesson_id, config);
  }
  static async getCourseLessonComments(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    params?: CourseLessonCommentsParams,
    config?: AxiosRequestConfig
  ): Promise<SCCourseCommentType[]> {
    return CourseApiClient.getCourseLessonComments(id, section_id, lesson_id, params, config);
  }
  static async getCourseLessons(id: number | string, section_id: number | string, config?: AxiosRequestConfig): Promise<SCCourseLessonType[]> {
    return CourseApiClient.getCourseLessons(id, section_id, config);
  }
  static async createCourseLesson(data: SCCourseLessonType, config?: AxiosRequestConfig): Promise<SCCourseLessonType> {
    return CourseApiClient.createCourseLesson(data, config);
  }
  static async updateCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: SCCourseLessonType,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType> {
    return CourseApiClient.updateCourseLesson(id, section_id, lesson_id, data, config);
  }
  static async patchCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    data: Partial<SCCourseLessonType>,
    config?: AxiosRequestConfig
  ): Promise<SCCourseLessonType> {
    return CourseApiClient.patchCourseLesson(id, section_id, lesson_id, data, config);
  }
  static async deleteCourseLesson(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return CourseApiClient.deleteCourseLesson(id, section_id, lesson_id, config);
  }
  static async markLessonComplete(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return CourseApiClient.markLessonComplete(id, section_id, lesson_id, config);
  }
  static async markLessonIncomplete(
    id: number | string,
    section_id: number | string,
    lesson_id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return CourseApiClient.markLessonIncomplete(id, section_id, lesson_id, config);
  }
  static async changeCourseCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.changeCourseCover(id, data, config);
  }
  static async getCourseWaitingApproval(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseWaitingApproval(id, params, config);
  }
  static async getCourseSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseSuggestedUsers(id, search, config);
  }
  static async getCourseInvitedUsers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseInvitedUsers(id, params, config);
  }
  static async getCourseJoinedUsers(
    id: number | string,
    params?: CourseUsersParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseJoinedUsers(id, params, config);
  }
  static async joinOrAcceptInviteToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.joinOrAcceptInviteToCourse(id, config);
  }
  static async leaveOrRemoveCourseRequest(id: number | string, data?: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.leaveOrRemoveCourseRequest(id, data, config);
  }
  static async inviteOrAcceptUsersToCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.inviteOrAcceptUsersToCourse(id, data, config);
  }
  static async removeInvitationToCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.removeInvitationToCourse(id, data, config);
  }
  static async getCourseStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return CourseApiClient.getCourseStatus(id, config);
  }
}
