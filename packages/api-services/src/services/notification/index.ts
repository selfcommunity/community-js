import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCBroadcastMessageType, SCNotificationAggregatedType, SCNotificationUnseenCountType} from '@selfcommunity/types';
import {CustomNotificationParams, SCPaginatedResponse} from '../../types';

export interface NotificationApiClientInterface {
  listUserNotification(): Promise<SCPaginatedResponse<SCNotificationAggregatedType>>;
  markReadNotification(sids: string[]): Promise<any>;
  getUnseenNotification(): Promise<SCNotificationUnseenCountType>;
  createCustomNotification(data: CustomNotificationParams): Promise<any>;
  listBroadcastMessages(): Promise<SCPaginatedResponse<SCBroadcastMessageType>>;
  listBroadcastMessagesUnseenCount(): Promise<SCNotificationUnseenCountType>;
  listBroadcastMessagesUndisposedCount(): Promise<SCNotificationUnseenCountType>;
  markReadBroadcastMessages(banner_ids: number[]): Promise<any>;
  disposeBroadcastMessages(banner_ids: number[]): Promise<any>;
}
/**
 * Contains all the endpoints needed to manage notifications.
 */

export class NotificationApiClient {
  /**
   * List all user notifications (in aggregate form) related to the community.
   */
  static listUserNotification(): Promise<SCPaginatedResponse<SCNotificationAggregatedType>> {
    return apiRequest(Endpoints.UserNotificationList.url({}), Endpoints.UserNotificationList.method);
  }

  /**
   * This endpoint marks as read a list of notifications identified by serialization_ids (sids).
   * @param sids
   */
  static markReadNotification(sids: string[]): Promise<any> {
    return apiRequest(Endpoints.UserMarkReadNotification.url({}), Endpoints.UserMarkReadNotification.method, {sids: sids});
  }

  /**
   * This endpoint retrieves the number of unseen/unread notifications.
   */
  static getUnseenNotification(): Promise<SCNotificationUnseenCountType> {
    return apiRequest(Endpoints.UserUnseenNotificationCount.url({}), Endpoints.UserUnseenNotificationCount.method);
  }

  /**
   * This endpoint generates a custom notification starting from the user. The recipients of the notification can be the user's friends/followers or the user himself (based on recipients_type value). Es. connections -> "user" added an item to the wishlist.
   * @param data
   */
  static createCustomNotification(data: CustomNotificationParams): Promise<any> {
    return apiRequest(Endpoints.CreateCustomNotification.url({}), Endpoints.CreateCustomNotification.method, data);
  }

  /**
   * This endpoint lists all broadcast messages. Broadcast Message is a feature which allows a specific user to send messages and announcements to a larger group of users at once.
   */
  static listBroadcastMessages(): Promise<SCPaginatedResponse<SCBroadcastMessageType>> {
    return apiRequest(Endpoints.BroadcastMessagesList.url({}), Endpoints.BroadcastMessagesList.method);
  }

  /**
   * This endpoint retrieves the total number of broadcast messages not yet seen by the user.
   */
  static listBroadcastMessagesUnseenCount(): Promise<SCNotificationUnseenCountType> {
    return apiRequest(Endpoints.BroadcastMessagesUnseenCount.url({}), Endpoints.BroadcastMessagesUnseenCount.method);
  }

  /**
   * This endpoint retrieves the total number of broadcast messages not yet disposed by the user.
   */
  static listBroadcastMessagesUndisposedCount(): Promise<SCNotificationUnseenCountType> {
    return apiRequest(Endpoints.BroadcastMessagesUndisposedCount.url({}), Endpoints.BroadcastMessagesUndisposedCount.method);
  }

  /**
   * This endpoint marks as viewed/read a broadcast message for a user.
   * @param banner_ids
   */
  static markReadBroadcastMessages(banner_ids: number[]): Promise<any> {
    return apiRequest(Endpoints.BroadcastMessagesMarkRead.url({}), Endpoints.BroadcastMessagesMarkRead.method, {banner_ids: banner_ids});
  }

  /**
   * This endpoint disposes a broadcast message for a user.
   * @param banner_ids
   */
  static disposeBroadcastMessages(banner_ids: number[]): Promise<any> {
    return apiRequest(Endpoints.BroadcastMessagesDispose.url({}), Endpoints.BroadcastMessagesDispose.method, {banner_ids: banner_ids});
  }
}

/**
 *
 :::tipEmbed service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {NotificationService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `listUserNotification` will return the paginated list of notifications.

 async listUserNotification() {
       return await NotificationService.listUserNotification();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async disposeBroadcastMessages(banner_ids) {
        return await NotificationService.disposeBroadcastMessages(banner_ids);
     }
 ```
 :::
 */
export default class NotificationService {
  static async listUserNotification(): Promise<SCPaginatedResponse<SCNotificationAggregatedType>> {
    return NotificationApiClient.listUserNotification();
  }
  static async markReadNotification(sids: string[]): Promise<any> {
    return NotificationApiClient.markReadNotification(sids);
  }
  static async getUnseenNotification(): Promise<SCNotificationUnseenCountType> {
    return NotificationApiClient.getUnseenNotification();
  }
  static async createCustomNotification(data: CustomNotificationParams): Promise<any> {
    return NotificationApiClient.createCustomNotification(data);
  }
  static async listBroadcastMessages(): Promise<SCPaginatedResponse<SCBroadcastMessageType>> {
    return NotificationApiClient.listBroadcastMessages();
  }
  static async listBroadcastMessagesUnseenCount(): Promise<SCNotificationUnseenCountType> {
    return NotificationApiClient.listBroadcastMessagesUnseenCount();
  }
  static async listBroadcastMessagesUndisposedCount(): Promise<SCNotificationUnseenCountType> {
    return NotificationApiClient.listBroadcastMessagesUndisposedCount();
  }
  static async disposeBroadcastMessages(banner_ids: number[]): Promise<any> {
    return NotificationApiClient.disposeBroadcastMessages(banner_ids);
  }
  static async markReadBroadcastMessages(banner_ids: number[]): Promise<any> {
    return NotificationApiClient.markReadBroadcastMessages(banner_ids);
  }
}
