import { SCEventType, SCMediaType, SCUserType } from '@selfcommunity/types';
import { AxiosRequestConfig } from 'axios';
import Endpoints from '../../constants/Endpoints';
import {
  BaseGetParams,
  BaseSearchParams,
  EventCreateParams,
  EventFeedParams,
  EventRelatedParams,
  EventSearchParams,
  SCPaginatedResponse
} from '../../types';
import { EventUserParams } from '../../types/event';
import { apiRequest } from '../../utils/apiRequest';
import { urlParams } from '../../utils/url';

export interface EventApiClientInterface {
  // Events subscribed to by the user
  getUserEvents(params?: EventUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>>;

  // Events subscribed by the user identified with :id in the path params (for the rest it is the same as getUserEvents)
  getUserSubscribedEvents(id: number | string, params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>>;

  // Events created by the user
  getUserCreatedEvents(params?: EventRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>>;

  // Events search
  searchEvents(params?: EventSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>>;

  // Event detail
  getSpecificEventInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCEventType>;

  // Event feed - if I am not subscribed to the event it does not return the data
  getEventFeed(id: number | string, params?: EventFeedParams, config?: AxiosRequestConfig): Promise<any>;

  // Events CRUD
  createEvent(data: EventCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCEventType>;
  updateEvent(id: number | string, data: SCEventType, config?: AxiosRequestConfig): Promise<SCEventType>;
  patchEvent(id: number | string, data: SCEventType, config?: AxiosRequestConfig): Promise<SCEventType>;
  deleteEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Event image change (bigger, big, medium, small)
  changeEventCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCEventType>;

  // Users subscribed to the event
  getEventMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users awaiting approval subscribers
  getEventWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;

  // Given an already existing event, it suggests users to invite
  getEventSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Given an event being created, it suggests users to invite
  getEventsSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users invited to the event
  getEventInvitedUsers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users participating in the event - going to the event
  getUsersGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Users who declare not to participate in the event
  getUsersNotGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;

  // Subscribe/Unsubscribe
  subscribeToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  unsubscribeFromEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // To invite a user or to accept a request to participate in the event (in the end the user is ONLY subscribed to the event)
  // To request participation in a private event use subscribeToEvent which automatically manages the subscription to a private/public event
  inviteOrAcceptEventRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // Remove invites - only for event moderator or user authenticated
  removeInviteEvent(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;

  // Event subscription status
  getEventSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Action go to event
  goToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  // Action remove go to event
  removeGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Action not going to the event
  notGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  // Action remove not going to the event
  removeNotGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Related events - created_by -> filter by a user
  getEventRelated(id: number | string, params?: EventRelatedParams, config?: AxiosRequestConfig): Promise<any>;

  // Hide/Show apis Event -> to remove contents related to the event in the feed
  showEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  hideEvent(id: number | string, config?: AxiosRequestConfig): Promise<any>;

  // Get/Add/Remove Event Photo gallery
  getEventPhotoGallery(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCMediaType>>;
  addMediaToEventPhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType>;
  removeMediasFromEventPhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<void>;
}
/**
 * Contains all the endpoints needed to manage events.
 */
export class EventApiClient {
  /**
   * This endpoint retrieves all the events of the logged-in user.
   * @param params
   * @param config
   */
  static getUserEvents(params?: EventUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetUserEvents.url({})}?${p.toString()}`, method: Endpoints.GetUserEvents.method});
  }

  /**
   * This endpoint retrieves a specific user events.
   * @param id
   * @param params
   * @param config
   */
  static getUserSubscribedEvents(
    id: number | string,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCEventType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetUserSubscribedEvents.url({id})}?${p.toString()}`,
      method: Endpoints.GetUserSubscribedEvents.method
    });
  }

  /**
   * This endpoint returns all events cretaed by a specific event.
   * @param id
   * @param params
   * @param config
   */
  static getUserCreatedEvents(params?: EventRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetUserCreatedEvents.url({})}?${p.toString()}`, method: Endpoints.GetUserCreatedEvents.method});
  }

  /**
   * This endpoint performs events search
   * @param params
   * @param config
   */
  static searchEvents(params?: EventSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchEvents.url({})}?${p.toString()}`, method: Endpoints.SearchEvents.method});
  }

  /**
   * This endpoint retrieves a specific event.
   * @param id
   * @param config
   */
  static getSpecificEventInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCEventType> {
    return apiRequest({...config, url: Endpoints.GetEventInfo.url({id}), method: Endpoints.GetEventInfo.method});
  }

  /**
   * This endpoint performs events search
   * @param id
   * @param params
   * @param config
   */
  static getEventFeed(id: number | string, params?: EventFeedParams, config?: AxiosRequestConfig): Promise<any> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetEventFeed.url({id})}?${p.toString()}`, method: Endpoints.GetEventFeed.method});
  }

  /**
   * This endpoint creates an event.
   * @param data
   * @param config
   */
  static createEvent(data: EventCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCEventType> {
    return apiRequest({...config, url: Endpoints.CreateEvent.url({}), method: Endpoints.CreateEvent.method, data: data});
  }

  /**
   * This endpoint updates an event.
   * @param id
   * @param data
   * @param config
   */
  static updateEvent(id: number | string, data: SCEventType, config?: AxiosRequestConfig): Promise<SCEventType> {
    return apiRequest({...config, url: Endpoints.UpdateEvent.url({id}), method: Endpoints.UpdateEvent.method, data: data});
  }

  /**
   * This endpoint patches an  event.
   * @param id
   * @param data
   * @param config
   */
  static patchEvent(id: number | string, data: SCEventType, config?: AxiosRequestConfig): Promise<SCEventType> {
    return apiRequest({...config, url: Endpoints.PatchEvent.url({id}), method: Endpoints.PatchEvent.method, data: data});
  }
  /**
   * This endpoint deletes an  event.
   * @param id
   * @param config
   */
  static deleteEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteEvent.url({id}), method: Endpoints.DeleteEvent.method});
  }

  /**
   * This endpoint changes the event avatar
   * @param id
   * @param data
   * @param config
   */
  static changeEventCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCEventType> {
    return apiRequest({url: Endpoints.PatchEvent.url({id}), method: Endpoints.PatchEvent.method, data, ...config});
  }
  /**
   * This endpoint returns all subscribers of a specific event.
   * @param id
   * @param params
   * @param config
   */
  static getEventMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetEventSubscribers.url({id})}?${p.toString()}`, method: Endpoints.GetEventSubscribers.method});
  }
  /**
   * This endpoint returns all waiting approval subscribers
   * @param id
   * @param params
   * @param config
   */
  static getEventWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetEventWaitingApprovalSubscribers.url({id})}?${p.toString()}`,
      method: Endpoints.GetEventSubscribers.method
    });
  }
  /**
   * This endpoint returns a list of suggested users to invite to the event.
   * @param id
   * @param search
   * @param config
   */
  static getEventSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetEventSuggestedUsers.url({id, search}),
      method: Endpoints.GetEventSuggestedUsers.method
    });
  }

  /**
   * This endpoint returns a list of suggested users to invite to the events.
   * @param search
   * @param config
   */
  static getEventsSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetEventsSuggestedUsers.url({search}),
      method: Endpoints.GetEventsSuggestedUsers.method
    });
  }

  /**
   * This endpoint returns a list of invited users.
   * @param id
   * @param params
   * @param config
   */
  static getEventInvitedUsers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetEventInvitedUsers.url({id})}?${p.toString()}`, method: Endpoints.GetEventInvitedUsers.method});
  }

  /**
   * This endpoint returns a list of users attending the event.
   * @param id
   * @param params
   * @param config
   */
  static getUsersGoingToEvent(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetUsersGoingToEvent.url({id})}?${p.toString()}`, method: Endpoints.GetUsersGoingToEvent.method});
  }

  /**
   * This endpoint returns a list of users not attending the event.
   * @param id
   * @param params
   * @param config
   */
  static getUsersNotGoingToEvent(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetUsersNotGoingToEvent.url({id})}?${p.toString()}`,
      method: Endpoints.GetUsersNotGoingToEvent.method
    });
  }

  /**
   * This endpoint subscribes to an event.
   * @param id
   * @param config
   */
  static subscribeToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.SubscribeToEvent.url({id}), method: Endpoints.SubscribeToEvent.method});
  }

  /**
   * This endpoint unsubscribes from an event.
   * @param id
   * @param config
   */
  static unsubscribeFromEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UnsubscribeFromEvent.url({id}), method: Endpoints.UnsubscribeFromEvent.method});
  }

  /**
   * This endpoint allows to invite or accept an event invite.
   * @param id
   * @param data
   * @param config
   */
  static inviteOrAcceptEventRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.InviteOrAcceptEventRequest.url({id}),
      method: Endpoints.InviteOrAcceptEventRequest.method,
      data: data
    });
  }
  /**
   * This endpoint allows to remove invites.
   * @param id
   * @param data
   * @param config
   */
  static removeInviteEvent(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.RemoveInviteEvent.url({id}),
      method: Endpoints.RemoveInviteEvent.method,
      data: data
    });
  }
  /**
   * This endpoint retrieves the event subscription status.
   * @param id
   * @param config
   */
  static getEventSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.GetEventSubscriptionStatus.url({id}), method: Endpoints.GetEventSubscriptionStatus.method});
  }
  /**
   * This endpoint allows to attend an event
   * @param id
   * @param config
   */
  static goToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.GoToEvent.url({id}), method: Endpoints.GoToEvent.method});
  }
  /**
   * This endpoint allows to remove an event participation
   * @param id
   * @param config
   */
  static removeGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.RemoveGoingToEvent.url({id}), method: Endpoints.RemoveGoingToEvent.method});
  }
  /**
   * This endpoint allows to not attend an event
   * @param id
   * @param config
   */
  static notGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.NotGoingToEvent.url({id}), method: Endpoints.NotGoingToEvent.method});
  }
  /**
   * This endpoint allows to remove the event not attending
   * @param id
   * @param config
   */
  static removeNotGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.RemoveNotGoingToEvent.url({id}), method: Endpoints.RemoveNotGoingToEvent.method});
  }
  /**
   * This endpoint returns all events related of a specific event.
   * @param id
   * @param params
   * @param config
   */
  static getEventRelated(id: number | string, params?: EventRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetEventRelated.url({id})}?${p.toString()}`, method: Endpoints.GetEventRelated.method});
  }
  /**
   * This endpoint show a specific event.
   * @param id
   * @param config
   */
  static showEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.ShowEvent.url({id}), method: Endpoints.ShowEvent.method});
  }
  /**
   * This endpoint hide a specific event.
   * @param id
   * @param config
   */
  static hideEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.hideEvent.url({id}), method: Endpoints.hideEvent.method});
  }
  /**
   * This endpoint returns the gallery of a specific event.
   * @param id
   * @param params
   * @param config
   */
  static getEventPhotoGallery(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCMediaType>> {
    const p = urlParams(params);

    return apiRequest({
      ...config,
      url: `${Endpoints.GetEventPhotoGallery.url({id})}?${p.toString()}`,
      method: Endpoints.GetEventPhotoGallery.method
    });
  }
  /**
   * This endpoint adds the media in a gallery of a specific event.
   * @param id
   * @param config
   */
  static addMediaToEventPhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return apiRequest({
      ...config,
      url: Endpoints.AddMediaToEventPhotoGallery.url({id}),
      method: Endpoints.AddMediaToEventPhotoGallery.method
    });
  }
  /**
   * This endpoint removes the medias in a gallery of a specific event.
   * @param id
   * @param config
   */
  static removeMediasFromEventPhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<void> {
    return apiRequest({
      ...config,
      url: Endpoints.RemoveMediasFromEventPhotoGallery.url({id}),
      method: Endpoints.RemoveMediasFromEventPhotoGallery.method
    });
  }
}

/**
 *
 :::tip Incubator service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {EventService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `searchEvents` will return the events matching the search query.

 async searchEvents() {
         return await EventService.searchEvents();
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificEventInfo(eventId) {
         return await EventService.getSpecificEventInfo(eventId);
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
export default class EventService {
  static async getUserEvents(params?: EventUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    return EventApiClient.getUserEvents(params, config);
  }
  static async getUserSubscribedEvents(
    id: number | string,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCEventType>> {
    return EventApiClient.getUserSubscribedEvents(id, params, config);
  }
  static async getUserCretaedEvents(params?: EventRelatedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    return EventApiClient.getUserCreatedEvents(params, config);
  }
  static async searchEvents(params?: EventSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEventType>> {
    return EventApiClient.searchEvents(params, config);
  }
  static async getSpecificEventInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCEventType> {
    return EventApiClient.getSpecificEventInfo(id, config);
  }
  static async getEventFeed(id: number | string, params?: EventFeedParams, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.getEventFeed(id, params, config);
  }
  static async createEvent(data: EventCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCEventType> {
    return EventApiClient.createEvent(data, config);
  }
  static async updateEvent(id: number | string, data: SCEventType, config?: AxiosRequestConfig): Promise<SCEventType> {
    return EventApiClient.updateEvent(id, data, config);
  }
  static async patchEvent(id: number | string, data: SCEventType, config?: AxiosRequestConfig): Promise<SCEventType> {
    return EventApiClient.patchEvent(id, data, config);
  }
  static async deleteEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.deleteEvent(id, config);
  }
  static async changeEventCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCEventType> {
    return EventApiClient.changeEventCover(id, data, config);
  }
  static async getEventMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getEventMembers(id, params, config);
  }
  static async getEventWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getEventWaitingApprovalSubscribers(id, params, config);
  }
  static async getEventSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getEventSuggestedUsers(id, search, config);
  }
  static async getEventsSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getEventsSuggestedUsers(search, config);
  }
  static async getEventInvitedUsers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getEventInvitedUsers(id, params, config);
  }
  static async getUsersGoingToEvent(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getUsersGoingToEvent(id, params, config);
  }
  static async getUsersNotGoingToEvent(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return EventApiClient.getUsersNotGoingToEvent(id, params, config);
  }
  static async subscribeToEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.subscribeToEvent(id, config);
  }
  static async unsubscribeFromEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.unsubscribeFromEvent(id, config);
  }
  static async inviteOrAcceptEventRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.inviteOrAcceptEventRequest(id, data, config);
  }
  static async removeInviteEvent(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.removeInviteEvent(id, data, config);
  }
  static async getEventSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return EventApiClient.getEventSubscriptionStatus(id, config);
  }
  static async goToEvent(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return EventApiClient.goToEvent(id, config);
  }
  static async removeGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return EventApiClient.removeGoingToEvent(id, config);
  }
  static async notGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return EventApiClient.notGoingToEvent(id, config);
  }
  static async removeNotGoingToEvent(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return EventApiClient.removeNotGoingToEvent(id, config);
  }
  static async getEventRelated(
    id: number | string,
    params?: EventRelatedParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCEventType>> {
    return EventApiClient.getEventRelated(id, params, config);
  }
  static async showEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.showEvent(id, config);
  }
  static async hideEvent(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return EventApiClient.hideEvent(id, config);
  }
  static async getEventPhotoGallery(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCMediaType>> {
    return EventApiClient.getEventPhotoGallery(id, params, config);
  }
  static async addMediaToEventPhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return EventApiClient.addMediaToEventPhotoGallery(id, config);
  }
  static async removeMediasFromEventPhotoGallery(id: number | string, config?: AxiosRequestConfig): Promise<void> {
    return EventApiClient.removeMediasFromEventPhotoGallery(id, config);
  }
}
