import client, {HttpResponse} from '../../client';
import Endpoints from '../../constants/Endpoints';
import {SCWebhookEndpointType, SCWebhookEndpointAttemptType, SCWebhookEndpointSecretType} from '@selfcommunity/types';
import {WebhookParamType} from './types';

export interface WebhookApiClientInterface {
  getAllWebhookEndpoints(): Promise<SCWebhookEndpointType>;
  getAllWebhookEvents(): Promise<any>;
  createWebhookEndpoint(params: WebhookParamType): Promise<SCWebhookEndpointType>;
  getASpecificWebhookEndpoint(id: number): Promise<SCWebhookEndpointType>;
  updateASpecificWebhookEndpoint(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType>;
  updateASingleWebhookEndpointField(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType>;
  deleteWebhookEndpoint(id: number): Promise<any>;
  getAllWebhookEndpointAttempts(id: number): Promise<SCWebhookEndpointAttemptType>;
  expireWebhookSigningSecret(id: number): Promise<SCWebhookEndpointType>;
  revealWebhookSigningSecret(id: number, password?: string): Promise<SCWebhookEndpointSecretType>;
  resendWebhookEndpointEvent(id: number, event: number): Promise<any>;
  resendMultipleWebhookEndpointEvent(id: number, event: number[]): Promise<any>;
}

/**
 * Contains all the endpoints needed to manage webhooks.
 */
export class WebhookApiClient {
  /**
   * This endpoint retrieves all webhook endpoints
   */
  static getAllWebhookEndpoints(): Promise<HttpResponse<SCWebhookEndpointType>> {
    return client
      .request({
        url: Endpoints.WebhookEndpointsList.url({}),
        method: Endpoints.WebhookEndpointsList.method
      })
      .then((res: HttpResponse<SCWebhookEndpointType>) => {
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

  /**
   * This endpoint retrieves webhook events that can be enabled in the endpoint.
   */
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

  /**
   * This endpoint creates a webhook endpoint and connects it to the given webhook events.
   * @param params
   */
  static createWebhookEndpoint(params: WebhookParamType): Promise<HttpResponse<SCWebhookEndpointType>> {
    return client
      .request({
        url: Endpoints.WebhookCreate.url({}),
        method: Endpoints.WebhookCreate.method,
        data: {
          params
        }
      })
      .then((res: HttpResponse<any>) => {
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

  /**
   * This endpoint retrieves a specific webhook endpoint using ID.
   * @param id
   */
  static getASpecificWebhookEndpoint(id: number): Promise<SCWebhookEndpointType> {
    return client
      .request({
        url: Endpoints.GetSpecificWebhook.url({id}),
        method: Endpoints.GetSpecificWebhook.method
      })
      .then((res: HttpResponse<SCWebhookEndpointType>) => {
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

  /**
   * This endpoint updates a specific webhook endpoint.
   * @param id
   * @param params
   */
  static updateASpecificWebhookEndpoint(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType> {
    return client
      .request({
        url: Endpoints.WebhookUpdate.url({id}),
        method: Endpoints.WebhookUpdate.method,
        data: {
          params
        }
      })
      .then((res: HttpResponse<SCWebhookEndpointType>) => {
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

  /**
   * This endpoint updates a specific field for a specific webhook endpoint.
   * @param id
   * @param params
   */
  static updateASingleWebhookEndpointField(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType> {
    return client
      .request({
        url: Endpoints.WebhookPatch.url({id}),
        method: Endpoints.WebhookPatch.method,
        data: {
          params
        }
      })
      .then((res: HttpResponse<SCWebhookEndpointType>) => {
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

  /**
   * This endpoint deletes a Webhook Endpoint.
   * @param id
   */
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
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  /**
   * This endpoint retrieves the attempts related to this endpoint.
   * @param id
   */
  static getAllWebhookEndpointAttempts(id: number): Promise<SCWebhookEndpointAttemptType> {
    return client
      .request({
        url: Endpoints.WebhookEndpointAttempts.url({id}),
        method: Endpoints.WebhookEndpointAttempts.method
      })
      .then((res: HttpResponse<SCWebhookEndpointAttemptType>) => {
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

  /**
   * This endpoint expires the secret associated with this endpoint.
   * @param id
   */
  static expireWebhookSigningSecret(id: number): Promise<SCWebhookEndpointType> {
    return client
      .request({
        url: Endpoints.WebhookExpireSigningSecret.url({id}),
        method: Endpoints.WebhookExpireSigningSecret.method
      })
      .then((res: HttpResponse<SCWebhookEndpointType>) => {
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

  /**
   * This endpoint reveals the secret associated with this endpoint.
   * @param id
   * @param password
   */
  static revealWebhookSigningSecret(id: number, password?: string): Promise<SCWebhookEndpointSecretType> {
    return client
      .request({
        url: Endpoints.WebhookRevealSigningSecret.url({id}),
        method: Endpoints.WebhookRevealSigningSecret.method,
        data: {
          password: password ?? null
        }
      })
      .then((res: HttpResponse<SCWebhookEndpointSecretType>) => {
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

  /**
   * This endpoint resends the event specified as parameter to the endpoint specified by the id parameter.
   * @param id
   * @param event
   */
  static resendWebhookEndpointEvent(id: number, event: number): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookResendEndpointEvent.url({id}),
        method: Endpoints.WebhookResendEndpointEvent.method,
        data: {
          event: event
        }
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

  /**
   * This endpoint resends the events specified as parameters to the endpoint specified by the id parameter.
   * @param id
   * @param event
   */
  static resendMultipleWebhookEndpointEvent(id: number, event: number[]): Promise<any> {
    return client
      .request({
        url: Endpoints.WebhookResendMultipleEndpointEvent.url({id}),
        method: Endpoints.WebhookResendMultipleEndpointEvent.method,
        data: {
          event: event
        }
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
}

export default class WebhookService {
  static async getAllWebhookEndpoints(): Promise<HttpResponse<SCWebhookEndpointType>> {
    return WebhookApiClient.getAllWebhookEndpoints();
  }
  static async getAllWebhookEvents(): Promise<any> {
    return WebhookApiClient.getAllWebhookEvents();
  }
  static async createWebhookEndpoint(params: WebhookParamType): Promise<HttpResponse<SCWebhookEndpointType>> {
    return WebhookApiClient.createWebhookEndpoint(params);
  }
  static async getASpecificWebhookEndpoint(id: number): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.getASpecificWebhookEndpoint(id);
  }
  static async updateASpecificWebhookEndpoint(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.updateASpecificWebhookEndpoint(id, params);
  }
  static async updateASingleWebhookEndpointField(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.updateASingleWebhookEndpointField(id, params);
  }
  static async deleteWebhookEndpoint(id: number): Promise<any> {
    return WebhookApiClient.deleteWebhookEndpoint(id);
  }
  static async getAllWebhookEndpointAttempts(id: number): Promise<SCWebhookEndpointAttemptType> {
    return WebhookApiClient.getAllWebhookEndpointAttempts(id);
  }
  static async expireWebhookSigningSecret(id: number): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.expireWebhookSigningSecret(id);
  }
  static async revealWebhookSigningSecret(id: number, password?: string): Promise<SCWebhookEndpointSecretType> {
    return WebhookApiClient.revealWebhookSigningSecret(id, password);
  }
  static async resendWebhookEndpointEvent(id: number, event: number): Promise<any> {
    return WebhookApiClient.resendWebhookEndpointEvent(id, event);
  }
  static async resendMultipleWebhookEndpointEvent(id: number, event: number[]): Promise<any> {
    return WebhookApiClient.resendMultipleWebhookEndpointEvent(id, event);
  }
}
