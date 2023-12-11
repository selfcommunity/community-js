import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCBroadcastMessageType, SCNotificationAggregatedType, SCNotificationUnseenCountType} from '@selfcommunity/types';
import {CustomNotificationParams, SCPaginatedResponse} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface NotificationApiClientInterface {
  listUserNotification(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCNotificationAggregatedType>>;
  markReadNotification(sids: string[], config?: AxiosRequestConfig): Promise<any>;
  getUnseenNotification(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType>;
  createCustomNotification(data: CustomNotificationParams, config?: AxiosRequestConfig): Promise<any>;
  listBroadcastMessages(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCBroadcastMessageType>>;
  listBroadcastMessagesUnseenCount(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType>;
  listBroadcastMessagesUndisposedCount(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType>;
  markReadBroadcastMessages(banner_ids: number[], config?: AxiosRequestConfig): Promise<any>;
  disposeBroadcastMessages(banner_ids: number[], config?: AxiosRequestConfig): Promise<any>;
}
/**
 * Contains all the endpoints needed to manage notifications.
 */

export class NotificationApiClient {
  /**
   * List all user notifications (in aggregate form) related to the community.
   * @param config
   */
  static listUserNotification(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCNotificationAggregatedType>> {
    return apiRequest({...config, url: Endpoints.UserNotificationList.url({}), method: Endpoints.UserNotificationList.method});
  }

  /**
   * This endpoint marks as read a list of notifications identified by serialization_ids (sids).
   * @param sids
   * @param config
   */
  static markReadNotification(sids: string[], config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.UserMarkReadNotification.url({}),
      method: Endpoints.UserMarkReadNotification.method,
      data: {sids: sids}
    });
  }

  /**
   * This endpoint retrieves the number of unseen/unread notifications.
   * @param config
   */
  static getUnseenNotification(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType> {
    return apiRequest({...config, url: Endpoints.UserUnseenNotificationCount.url({}), method: Endpoints.UserUnseenNotificationCount.method});
  }

  /**
   * This endpoint generates a custom notification starting from the user. The recipients of the notification can be the user's friends/followers or the user himself (based on recipients_type value). Es. connections -> "user" added an item to the wishlist.
   * @param data
   * @param config
   */
  static createCustomNotification(data: CustomNotificationParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.CreateCustomNotification.url({}), method: Endpoints.CreateCustomNotification.method, data: data});
  }

  /**
   * This endpoint lists all broadcast messages. Broadcast Message is a feature which allows a specific user to send messages and announcements to a larger group of users at once.
   * @param config
   */
  static listBroadcastMessages(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCBroadcastMessageType>> {
    return apiRequest({...config, url: Endpoints.BroadcastMessagesList.url({}), method: Endpoints.BroadcastMessagesList.method});
  }

  /**
   * This endpoint retrieves the total number of broadcast messages not yet seen by the user.
   * @param config
   */
  static listBroadcastMessagesUnseenCount(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType> {
    return apiRequest({...config, url: Endpoints.BroadcastMessagesUnseenCount.url({}), method: Endpoints.BroadcastMessagesUnseenCount.method});
  }

  /**
   * This endpoint retrieves the total number of broadcast messages not yet disposed by the user.
   * @param config
   */
  static listBroadcastMessagesUndisposedCount(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType> {
    return apiRequest({
      ...config,
      url: Endpoints.BroadcastMessagesUndisposedCount.url({}),
      method: Endpoints.BroadcastMessagesUndisposedCount.method
    });
  }

  /**
   * This endpoint marks as viewed/read a broadcast message for a user.
   * @param banner_ids
   * @param config
   */
  static markReadBroadcastMessages(banner_ids: number[], config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.BroadcastMessagesMarkRead.url({}),
      method: Endpoints.BroadcastMessagesMarkRead.method,
      data: {banner_ids: banner_ids}
    });
  }

  /**
   * This endpoint disposes a broadcast message for a user.
   * @param banner_ids
   * @param config
   */
  static disposeBroadcastMessages(banner_ids: number[], config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.BroadcastMessagesDispose.url({}),
      method: Endpoints.BroadcastMessagesDispose.method,
      data: {banner_ids: banner_ids}
    });
  }
}

/**
 *
 :::tip Notification service can be used in the following way:

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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class NotificationService {
  static async listUserNotification(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCNotificationAggregatedType>> {
    return NotificationApiClient.listUserNotification(config);
  }
  static async markReadNotification(sids: string[], config?: AxiosRequestConfig): Promise<any> {
    return NotificationApiClient.markReadNotification(sids, config);
  }
  static async getUnseenNotification(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType> {
    return NotificationApiClient.getUnseenNotification(config);
  }
  static async createCustomNotification(data: CustomNotificationParams, config?: AxiosRequestConfig): Promise<any> {
    return NotificationApiClient.createCustomNotification(data, config);
  }
  static async listBroadcastMessages(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCBroadcastMessageType>> {
    return NotificationApiClient.listBroadcastMessages(config);
  }
  static async listBroadcastMessagesUnseenCount(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType> {
    return NotificationApiClient.listBroadcastMessagesUnseenCount(config);
  }
  static async listBroadcastMessagesUndisposedCount(config?: AxiosRequestConfig): Promise<SCNotificationUnseenCountType> {
    return NotificationApiClient.listBroadcastMessagesUndisposedCount(config);
  }
  static async disposeBroadcastMessages(banner_ids: number[], config?: AxiosRequestConfig): Promise<any> {
    return NotificationApiClient.disposeBroadcastMessages(banner_ids, config);
  }
  static async markReadBroadcastMessages(banner_ids: number[], config?: AxiosRequestConfig): Promise<any> {
    return NotificationApiClient.markReadBroadcastMessages(banner_ids, config);
  }
}
