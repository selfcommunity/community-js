import {SCCourseType, SCMediaType, SCUserType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import Endpoints from '../../constants/Endpoints';
import {
  BaseGetParams,
  BaseSearchParams,
  CourseCreateParams,
  CourseFeedParams,
  CourseRelatedParams,
  CourseSearchParams,
  SCPaginatedResponse
} from '../../types';
import {CourseUserParams} from '../../types/course';
import {apiRequest} from '../../utils/apiRequest';
import {urlParams} from '../../utils/url';

export interface CourseApiClientInterface {
  // Courses subscribed to by the user
  getUserCourses(params?: CourseUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Courses subscribed by the user identified with :id in the path params (for the rest it is the same as getUserCourses)
  getUserSubscribedCourses(id: number | string, params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Courses created by the user
  getUserCreatedCourses(params?: CourseRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Courses search
  searchCourses(params?: CourseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>>;

  // Course detail
  getSpecificCourseInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCCourseType>;

  // Course feed - if I am not subscribed to the course it does not return the data
  getCourseFeed(id: number | string, params?: CourseFeedParams, config?: AxiosRequestConfig): Promise<any>;

  // Courses CRUD
  createCourse(data: CourseCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCCourseType>;
  updateCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType>;
  patchCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType>;
  deleteCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Course image change (bigger, big, medium, small)
  changeCourseCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCCourseType>;

  // Users subscribed to the course
  getCourseMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users awaiting approval subscribers
  getCourseWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;

  // Given an already existing course, it suggests users to invite
  getCourseSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Given a course being created, it suggests users to invite
  getCoursesSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users invited to the course
  getCourseInvitedUsers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users participating in the course - going to the course
  getUsersGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users who declare not to participate in the course
  getUsersNotGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Subscribe/Unsubscribe
  subscribeToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  unsubscribeFromCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // To invite a user or to accept a request to participate in the course (in the end the user is ONLY subscribed to the course)
  // To request participation in a private course use subscribeToCourse which automatically manages the subscription to a private/public course
  inviteOrAcceptCourseRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // Remove invites - only for course moderator or user authenticated
  removeInviteCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // Course subscription status
  getCourseSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Action go to course
  goToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  // Action remove go to course
  removeGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Action not going to the course
  notGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  // Action remove not going to the course
  removeNotGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Related events - created_by -> filter by a user
  getCourseRelated(id: number | string, params?: CourseRelatedParams, config?: AxiosRequestConfig): Promise<any>;

  // Hide/Show apis Course -> to remove contents related to the course in the feed
  showCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  hideCourse(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Get/Add/Remove Course Photo gallery
  getCoursePhotoGallery(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCMediaType>>;
  addMediaToCoursePhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType>;
  removeMediasFromCoursePhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<void>;
}
/**
 * Contains all the endpoints needed to manage events.
 */
export class CourseApiClient {
  /**
   * This endpoint retrieves all the events of the logged-in user.
   * @param params
   * @param config
   */
  static getUserCourses(params?: CourseUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetUserCourses.url({})}?${p.toString()}`, method: Endpoints.GetUserCourses.method});
  }

  /**
   * This endpoint retrieves a specific user events.
   * @param id
   * @param params
   * @param config
   */
  static getUserSubscribedCourses(
    id: number | string,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCCourseType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetUserSubscribedCourses.url({id})}?${p.toString()}`,
      method: Endpoints.GetUserSubscribedCourses.method
    });
  }

  /**
   * This endpoint returns all events created by a specific course.
   * @param params
   * @param config
   */
  static getUserCreatedCourses(params?: CourseRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetUserCreatedCourses.url({})}?${p.toString()}`, method: Endpoints.GetUserCreatedCourses.method});
  }

  /**
   * This endpoint performs events search
   * @param params
   * @param config
   */
  static searchCourses(params?: CourseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchCourses.url({})}?${p.toString()}`, method: Endpoints.SearchCourses.method});
  }

  /**
   * This endpoint retrieves a specific course.
   * @param id
   * @param config
   */
  static getSpecificCourseInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.GetCourseInfo.url({id}), method: Endpoints.GetCourseInfo.method});
  }

  /**
   * This endpoint performs events search
   * @param id
   * @param params
   * @param config
   */
  static getCourseFeed(id: number | string, params?: CourseFeedParams, config?: AxiosRequestConfig): Promise<any> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetCourseFeed.url({id})}?${p.toString()}`, method: Endpoints.GetCourseFeed.method});
  }

  /**
   * This endpoint creates a course.
   * @param data
   * @param config
   */
  static createCourse(data: CourseCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.CreateCourse.url({}), method: Endpoints.CreateCourse.method, data: data});
  }

  /**
   * This endpoint updates a course.
   * @param id
   * @param data
   * @param config
   */
  static updateCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.UpdateCourse.url({id}), method: Endpoints.UpdateCourse.method, data: data});
  }

  /**
   * This endpoint patches a  course.
   * @param id
   * @param data
   * @param config
   */
  static patchCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({...config, url: Endpoints.PatchCourse.url({id}), method: Endpoints.PatchCourse.method, data: data});
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
   * This endpoint changes the course avatar
   * @param id
   * @param data
   * @param config
   */
  static changeCourseCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return apiRequest({url: Endpoints.PatchCourse.url({id}), method: Endpoints.PatchCourse.method, data, ...config});
  }
  /**
   * This endpoint returns all subscribers of a specific course.
   * @param id
   * @param params
   * @param config
   */
  static getCourseMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetCourseSubscribers.url({id})}?${p.toString()}`, method: Endpoints.GetCourseSubscribers.method});
  }
  /**
   * This endpoint returns all waiting approval subscribers
   * @param id
   * @param params
   * @param config
   */
  static getCourseWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetCourseWaitingApprovalSubscribers.url({id})}?${p.toString()}`,
      method: Endpoints.GetCourseSubscribers.method
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
   * This endpoint returns a list of suggested users to invite to the events.
   * @param search
   * @param config
   */
  static getCoursesSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetCoursesSuggestedUsers.url({search}),
      method: Endpoints.GetCoursesSuggestedUsers.method
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
   * This endpoint returns a list of users attending the course.
   * @param id
   * @param params
   * @param config
   */
  static getUsersGoingToCourse(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetUsersGoingToCourse.url({id})}?${p.toString()}`,
      method: Endpoints.GetUsersGoingToCourse.method
    });
  }

  /**
   * This endpoint returns a list of users not attending the course.
   * @param id
   * @param params
   * @param config
   */
  static getUsersNotGoingToCourse(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetUsersNotGoingToCourse.url({id})}?${p.toString()}`,
      method: Endpoints.GetUsersNotGoingToCourse.method
    });
  }

  /**
   * This endpoint subscribes to a course.
   * @param id
   * @param config
   */
  static subscribeToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.SubscribeToCourse.url({id}), method: Endpoints.SubscribeToCourse.method});
  }

  /**
   * This endpoint unsubscribes from a course.
   * @param id
   * @param config
   */
  static unsubscribeFromCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UnsubscribeFromCourse.url({id}), method: Endpoints.UnsubscribeFromCourse.method});
  }

  /**
   * This endpoint allows to invite or accept a course invite.
   * @param id
   * @param data
   * @param config
   */
  static inviteOrAcceptCourseRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.InviteOrAcceptCourseRequest.url({id}),
      method: Endpoints.InviteOrAcceptCourseRequest.method,
      data: data
    });
  }
  /**
   * This endpoint allows to remove invites.
   * @param id
   * @param data
   * @param config
   */
  static removeInviteCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.RemoveInviteCourse.url({id}),
      method: Endpoints.RemoveInviteCourse.method,
      data: data
    });
  }
  /**
   * This endpoint retrieves the course subscription status.
   * @param id
   * @param config
   */
  static getCourseSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.GetCourseSubscriptionStatus.url({id}), method: Endpoints.GetCourseSubscriptionStatus.method});
  }
  /**
   * This endpoint allows to attend a course
   * @param id
   * @param config
   */
  static goToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.GoToCourse.url({id}), method: Endpoints.GoToCourse.method});
  }
  /**
   * This endpoint allows to remove a course participation
   * @param id
   * @param config
   */
  static removeGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.RemoveGoingToCourse.url({id}), method: Endpoints.RemoveGoingToCourse.method});
  }
  /**
   * This endpoint allows to not attend a course
   * @param id
   * @param config
   */
  static notGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.NotGoingToCourse.url({id}), method: Endpoints.NotGoingToCourse.method});
  }
  /**
   * This endpoint allows to remove the course not attending
   * @param id
   * @param config
   */
  static removeNotGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.RemoveNotGoingToCourse.url({id}), method: Endpoints.RemoveNotGoingToCourse.method});
  }
  /**
   * This endpoint returns all events related of a specific course.
   * @param id
   * @param params
   * @param config
   */
  static getCourseRelated(
    id: number | string,
    params?: CourseRelatedParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCCourseType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetCourseRelated.url({id})}?${p.toString()}`, method: Endpoints.GetCourseRelated.method});
  }
  /**
   * This endpoint show a specific course.
   * @param id
   * @param config
   */
  static showCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.ShowCourse.url({id}), method: Endpoints.ShowCourse.method});
  }
  /**
   * This endpoint hide a specific course.
   * @param id
   * @param config
   */
  static hideCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.hideCourse.url({id}), method: Endpoints.hideCourse.method});
  }
  /**
   * This endpoint returns the gallery of a specific course.
   * @param id
   * @param params
   * @param config
   */
  static getCoursePhotoGallery(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCMediaType>> {
    const p = urlParams(params);

    return apiRequest({
      ...config,
      url: `${Endpoints.GetCoursePhotoGallery.url({id})}?${p.toString()}`,
      method: Endpoints.GetCoursePhotoGallery.method
    });
  }
  /**
   * This endpoint adds the media in a gallery of a specific course.
   * @param id
   * @param config
   */
  static addMediaToCoursePhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return apiRequest({
      ...config,
      url: Endpoints.AddMediaToCoursePhotoGallery.url({id}),
      method: Endpoints.AddMediaToCoursePhotoGallery.method
    });
  }
  /**
   * This endpoint removes the medias in a gallery of a specific course.
   * @param id
   * @param config
   */
  static removeMediasFromCoursePhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<void> {
    return apiRequest({
      ...config,
      url: Endpoints.RemoveMediasFromCoursePhotoGallery.url({id}),
      method: Endpoints.RemoveMediasFromCoursePhotoGallery.method
    });
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
  static async getUserCourses(params?: CourseUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.getUserCourses(params, config);
  }
  static async getUserSubscribedCourses(
    id: number | string,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.getUserSubscribedCourses(id, params, config);
  }
  static async getUserCreatedCourses(params?: CourseRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.getUserCreatedCourses(params, config);
  }
  static async searchCourses(params?: CourseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.searchCourses(params, config);
  }
  static async getSpecificCourseInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.getSpecificCourseInfo(id, config);
  }
  static async getCourseFeed(id: number | string, params?: CourseFeedParams, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.getCourseFeed(id, params, config);
  }
  static async createCourse(data: CourseCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.createCourse(data, config);
  }
  static async updateCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.updateCourse(id, data, config);
  }
  static async patchCourse(id: number | string, data: SCCourseType, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.patchCourse(id, data, config);
  }
  static async deleteCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.deleteCourse(id, config);
  }
  static async changeCourseCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCCourseType> {
    return CourseApiClient.changeCourseCover(id, data, config);
  }
  static async getCourseMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseMembers(id, params, config);
  }
  static async getCourseWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseWaitingApprovalSubscribers(id, params, config);
  }
  static async getCourseSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseSuggestedUsers(id, search, config);
  }
  static async getCoursesSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCoursesSuggestedUsers(search, config);
  }
  static async getCourseInvitedUsers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getCourseInvitedUsers(id, params, config);
  }
  static async getUsersGoingToCourse(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getUsersGoingToCourse(id, params, config);
  }
  static async getUsersNotGoingToCourse(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CourseApiClient.getUsersNotGoingToCourse(id, params, config);
  }
  static async subscribeToCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.subscribeToCourse(id, config);
  }
  static async unsubscribeFromCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.unsubscribeFromCourse(id, config);
  }
  static async inviteOrAcceptCourseRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.inviteOrAcceptCourseRequest(id, data, config);
  }
  static async removeInviteCourse(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.removeInviteCourse(id, data, config);
  }
  static async getCourseSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return CourseApiClient.getCourseSubscriptionStatus(id, config);
  }
  static async goToCourse(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return CourseApiClient.goToCourse(id, config);
  }
  static async removeGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return CourseApiClient.removeGoingToCourse(id, config);
  }
  static async notGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return CourseApiClient.notGoingToCourse(id, config);
  }
  static async removeNotGoingToCourse(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return CourseApiClient.removeNotGoingToCourse(id, config);
  }
  static async getCourseRelated(
    id: number | string,
    params?: CourseRelatedParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCCourseType>> {
    return CourseApiClient.getCourseRelated(id, params, config);
  }
  static async showCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.showCourse(id, config);
  }
  static async hideCourse(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CourseApiClient.hideCourse(id, config);
  }
  static async getCoursePhotoGallery(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCMediaType>> {
    return CourseApiClient.getCoursePhotoGallery(id, params, config);
  }
  static async addMediaToCoursePhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return CourseApiClient.addMediaToCoursePhotoGallery(id, config);
  }
  static async removeMediasFromCoursePhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<void> {
    return CourseApiClient.removeMediasFromCoursePhotoGallery(id, config);
  }
}
