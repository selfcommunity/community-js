import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface WebhookApiClientInterface {
  getAllWebhookEndpoints(): Promise<any>;
  getAllWebhookEvents(): Promise<any>;
  createWebhookEndpoint(): Promise<any>;
  getASpecificWebhookEndpoint(id: number): Promise<any>;
  updateASpecificWebhookEndpoint(id: number): Promise<any>;
  updateASingleWebhookEndpointField(id: number): Promise<any>;
  deleteWebhookEndpoint(id: number): Promise<any>;
  getAllWebhookEndpointAttempts(): Promise<any>;
  expireWebhookSigningSecret(id: number): Promise<any>;
  revealWebhookSigningSecret(id: number): Promise<any>;
  resendWebhookEndpointEvent(id: number): Promise<any>;
  resendMultipleWebhookEndpointEvent(id: number): Promise<any>;
}

export class WebhookApiClient {
  static getAllWebhookEndpoints(): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookEndpointsList.url({}),
        method: Endpoints.WebhookEndpointsList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve webhook endpoints (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve endpoints.');
        return Promise.reject(error);
      });
  }

  static getAllWebhookEvents(): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookEventsList.url({}),
        method: Endpoints.WebhookEventsList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve webhook endpoints events (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve endpoints events.');
        return Promise.reject(error);
      });
  }

  static createWebhookEndpoint(): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookCreate.url({}),
        method: Endpoints.WebhookCreate.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getASpecificWebhookEndpoint(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetSpecificWebhook.url({id}),
        method: Endpoints.GetSpecificWebhook.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve webhook (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve webhook.');
        return Promise.reject(error);
      });
  }

  static updateASpecificWebhookEndpoint(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookUpdate.url({id}),
        method: Endpoints.WebhookUpdate.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static updateASingleWebhookEndpointField(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookPatch.url({id}),
        method: Endpoints.WebhookPatch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static deleteWebhookEndpoint(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookDelete.url({id}),
        method: Endpoints.WebhookDelete.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getAllWebhookEndpointAttempts(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookEndpointAttempts.url({id}),
        method: Endpoints.WebhookEndpointAttempts.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve webhook endpoint attempts (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve webhook endpoint attempts.');
        return Promise.reject(error);
      });
  }

  static expireWebhookSigningSecret(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookExpireSigningSecret.url({id}),
        method: Endpoints.WebhookExpireSigningSecret.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static revealWebhookSigningSecret(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookRevealSigningSecret.url({id}),
        method: Endpoints.WebhookRevealSigningSecret.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action(Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
  static resendWebhookEndpointEvent(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookResendEndpointEvent.url({id}),
        method: Endpoints.WebhookResendEndpointEvent.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
  static resendMultipleWebhookEndpointEvent(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookResendMultipleEndpointEvent.url({id}),
        method: Endpoints.WebhookResendMultipleEndpointEvent.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
}

export default class WebhookService {
  static async getAllWebhookEndpoints(): Promise<any> {
    return WebhookApiClient.getAllWebhookEndpoints();
  }
  static async getAllWebhookEvents(): Promise<any> {
    return WebhookApiClient.getAllWebhookEvents();
  }
  static async createWebhookEndpoint(): Promise<any> {
    return WebhookApiClient.createWebhookEndpoint();
  }
  static async getASpecificWebhookEndpoint(id: number): Promise<any> {
    return WebhookApiClient.getASpecificWebhookEndpoint(id);
  }
  static async updateASpecificWebhookEndpoint(id: number): Promise<any> {
    return WebhookApiClient.updateASpecificWebhookEndpoint(id);
  }
  static async updateASingleWebhookEndpointField(id: number): Promise<any> {
    return WebhookApiClient.updateASingleWebhookEndpointField(id);
  }
  static async deleteWebhookEndpoint(id: number): Promise<any> {
    return WebhookApiClient.deleteWebhookEndpoint(id);
  }
  static async getAllWebhookEndpointAttempts(id: number): Promise<any> {
    return WebhookApiClient.getAllWebhookEndpointAttempts(id);
  }
  static async expireWebhookSigningSecret(id: number): Promise<any> {
    return WebhookApiClient.expireWebhookSigningSecret(id);
  }
  static async revealWebhookSigningSecret(id: number): Promise<any> {
    return WebhookApiClient.revealWebhookSigningSecret(id);
  }
  static async resendWebhookEndpointEvent(id: number): Promise<any> {
    return WebhookApiClient.resendWebhookEndpointEvent(id);
  }
  static async resendMultipleWebhookEndpointEvent(id: number): Promise<any> {
    return WebhookApiClient.resendMultipleWebhookEndpointEvent(id);
  }
}
