import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface NotificationApiClientInterface {
  listUserNotification(): Promise<any>;
  markReadNotification(): Promise<any>;
  getUnseenNotification(): Promise<any>;
  createCustomNotification(): Promise<any>;
  listBroadcastMessages(): Promise<any>;
  listBroadcastMessagesUnseenCount(): Promise<any>;
  listBroadcastMessagesUndisposedCount(): Promise<any>;
  markReadBroadcastMessages(): Promise<any>;
  disposeBroadcastMessages(): Promise<any>;
}

export class NotificationApiClient {
  static listUserNotification(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserNotificationList.url({}),
        method: Endpoints.UserNotificationList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }
  static markReadNotification(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserMarkReadNotification.url({}),
        method: Endpoints.UserMarkReadNotification.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getUnseenNotification(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserUnseenNotificationCount.url({}),
        method: Endpoints.UserUnseenNotificationCount.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }

  static createCustomNotification(): Promise<any> {
    return client
      .request({
        url: Endpoints.CreateCustomNotification.url({}),
        method: Endpoints.CreateCustomNotification.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static listBroadcastMessages(): Promise<any> {
    return client
      .request({
        url: Endpoints.BroadcastMessagesList.url({}),
        method: Endpoints.BroadcastMessagesList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }

  static listBroadcastMessagesUnseenCount(): Promise<any> {
    return client
      .request({
        url: Endpoints.BroadcastMessagesUnseenCount.url({}),
        method: Endpoints.BroadcastMessagesUnseenCount.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }
  static listBroadcastMessagesUndisposedCount(): Promise<any> {
    return client
      .request({
        url: Endpoints.BroadcastMessagesUndisposedCount.url({}),
        method: Endpoints.BroadcastMessagesUndisposedCount.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }
  static markReadBroadcastMessages(): Promise<any> {
    return client
      .request({
        url: Endpoints.BroadcastMessagesMarkRead.url({}),
        method: Endpoints.BroadcastMessagesMarkRead.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
  static disposeBroadcastMessages(): Promise<any> {
    return client
      .request({
        url: Endpoints.BroadcastMessagesDispose.url({}),
        method: Endpoints.BroadcastMessagesDispose.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }
}

export default class NotificationService {
  static async listUserNotification(): Promise<any> {
    return NotificationApiClient.listUserNotification();
  }
  static async markReadNotification(): Promise<any> {
    return NotificationApiClient.markReadNotification();
  }
  static async getUnseenNotification(): Promise<any> {
    return NotificationApiClient.getUnseenNotification();
  }
  static async createCustomNotification(): Promise<any> {
    return NotificationApiClient.createCustomNotification();
  }
  static async listBroadcastMessages(): Promise<any> {
    return NotificationApiClient.listBroadcastMessages();
  }
  static async listBroadcastMessagesUnseenCount(): Promise<any> {
    return NotificationApiClient.listBroadcastMessagesUnseenCount();
  }
  static async listBroadcastMessagesUndisposedCount(): Promise<any> {
    return NotificationApiClient.listBroadcastMessagesUndisposedCount();
  }
  static async disposeBroadcastMessages(): Promise<any> {
    return NotificationApiClient.disposeBroadcastMessages();
  }
  static async markReadBroadcastMessages(): Promise<any> {
    return NotificationApiClient.markReadBroadcastMessages();
  }
}
