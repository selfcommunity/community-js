import Endpoints from '../../constants/Endpoints';
import {SCWebhookEndpointType, SCWebhookEndpointAttemptType, SCWebhookEndpointSecretType} from '@selfcommunity/types';
import {WebhookParamType} from '../../types';
import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';

export interface WebhookApiClientInterface {
  getAllWebhookEndpoints(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCWebhookEndpointType>>;
  getAllWebhookEvents(config?: AxiosRequestConfig): Promise<string[]>;
  createWebhookEndpoint(params: WebhookParamType, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType>;
  getASpecificWebhookEndpoint(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType>;
  updateASpecificWebhookEndpoint(id: number | string, params: WebhookParamType, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType>;
  updateASingleWebhookEndpointField(id: number | string, params: WebhookParamType, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType>;
  deleteWebhookEndpoint(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  getAllWebhookEndpointAttempts(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCWebhookEndpointAttemptType>>;
  expireWebhookSigningSecret(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType>;
  revealWebhookSigningSecret(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointSecretType>;
  resendWebhookEndpointEvent(id: number | string, event: number, config?: AxiosRequestConfig): Promise<any>;
  resendMultipleWebhookEndpointEvent(id: number | string, event: number[], config?: AxiosRequestConfig): Promise<any>;
}

/**
 * Contains all the endpoints needed to manage webhooks.
 */
export class WebhookApiClient {
  /**
   * This endpoint retrieves all webhook endpoints
   * @param config
   */
  static getAllWebhookEndpoints(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCWebhookEndpointType>> {
    return apiRequest({...config, url: Endpoints.WebhookEndpointsList.url({}), method: Endpoints.WebhookEndpointsList.method});
  }

  /**
   * This endpoint retrieves webhook events that can be enabled in the endpoint.
   * @param config
   */
  static getAllWebhookEvents(config?: AxiosRequestConfig): Promise<string[]> {
    return apiRequest({...config, url: Endpoints.WebhookEventsList.url({}), method: Endpoints.WebhookEventsList.method});
  }

  /**
   * This endpoint creates a webhook endpoint and connects it to the given webhook events.
   * @param data
   * @param config
   */
  static createWebhookEndpoint(data: WebhookParamType, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return apiRequest({...config, url: Endpoints.WebhookCreate.url({}), method: Endpoints.WebhookCreate.method, data: data});
  }

  /**
   * This endpoint retrieves a specific webhook endpoint using ID.
   * @param id
   * @param config
   */
  static getASpecificWebhookEndpoint(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return apiRequest({...config, url: Endpoints.GetSpecificWebhook.url({id}), method: Endpoints.GetSpecificWebhook.method});
  }

  /**
   * This endpoint updates a specific webhook endpoint.
   * @param id
   * @param params
   * @param config
   */
  static updateASpecificWebhookEndpoint(id: number | string, params: WebhookParamType, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return apiRequest({...config, url: Endpoints.WebhookUpdate.url({id}), method: Endpoints.WebhookUpdate.method, data: params});
  }

  /**
   * This endpoint updates a specific field for a specific webhook endpoint.
   * @param id
   * @param params
   * @param config
   */
  static updateASingleWebhookEndpointField(
    id: number | string,
    params: WebhookParamType,
    config?: AxiosRequestConfig
  ): Promise<SCWebhookEndpointType> {
    return apiRequest({...config, url: Endpoints.WebhookPatch.url({id}), method: Endpoints.WebhookPatch.method, data: params});
  }

  /**
   * This endpoint deletes a Webhook Endpoint.
   * @param id
   * @param config
   */
  static deleteWebhookEndpoint(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.WebhookDelete.url({id}), method: Endpoints.WebhookDelete.method});
  }

  /**
   * This endpoint retrieves the attempts related to this endpoint.
   * @param id
   * @param config
   */
  static getAllWebhookEndpointAttempts(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCWebhookEndpointAttemptType>> {
    return apiRequest({...config, url: Endpoints.WebhookEndpointAttempts.url({id}), method: Endpoints.WebhookEndpointAttempts.method});
  }

  /**
   * This endpoint expires the secret associated with this endpoint.
   * @param id
   * @param config
   */
  static expireWebhookSigningSecret(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return apiRequest({...config, url: Endpoints.WebhookExpireSigningSecret.url({id}), method: Endpoints.WebhookExpireSigningSecret.method});
  }

  /**
   * This endpoint reveals the secret associated with this endpoint.
   * @param id
   * @param config
   */
  static revealWebhookSigningSecret(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointSecretType> {
    return apiRequest({...config, url: Endpoints.WebhookRevealSigningSecret.url({id}), method: Endpoints.WebhookRevealSigningSecret.method});
  }

  /**
   * This endpoint resends the event specified as parameter to the endpoint specified by the id parameter.
   * @param id
   * @param event
   * @param config
   */
  static resendWebhookEndpointEvent(id: number | string, event: number, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.WebhookResendEndpointEvent.url({id}),
      method: Endpoints.WebhookResendEndpointEvent.method,
      data: {event: event}
    });
  }

  /**
   * This endpoint resends the events specified as parameters to the endpoint specified by the id parameter.
   * @param id
   * @param event
   * @param config
   */
  static resendMultipleWebhookEndpointEvent(id: number | string, event: number[], config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.WebhookResendMultipleEndpointEvent.url({id}),
      method: Endpoints.WebhookResendMultipleEndpointEvent.method,
      data: {event: event}
    });
  }
}

/**
 *
 :::tipWebhook service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {WebhookService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllWebhookEndpoints` will return the paginated list of webhook endpoints.

 async getAllWebhookEndpoints() {
       return await WebhookService.getAllWebhookEndpoints();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getASpecificWebhookEndpoint(webhookId) {
        return await WebhookService.getASpecificWebhookEndpoint(webhookId);
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
export default class WebhookService {
  static async getAllWebhookEndpoints(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCWebhookEndpointType>> {
    return WebhookApiClient.getAllWebhookEndpoints(config);
  }
  static async getAllWebhookEvents(config?: AxiosRequestConfig): Promise<any> {
    return WebhookApiClient.getAllWebhookEvents(config);
  }
  static async createWebhookEndpoint(params: WebhookParamType, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.createWebhookEndpoint(params, config);
  }
  static async getASpecificWebhookEndpoint(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.getASpecificWebhookEndpoint(id, config);
  }
  static async updateASpecificWebhookEndpoint(
    id: number | string,
    params: WebhookParamType,
    config?: AxiosRequestConfig
  ): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.updateASpecificWebhookEndpoint(id, params, config);
  }
  static async updateASingleWebhookEndpointField(
    id: number | string,
    params: WebhookParamType,
    config?: AxiosRequestConfig
  ): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.updateASingleWebhookEndpointField(id, params, config);
  }
  static async deleteWebhookEndpoint(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return WebhookApiClient.deleteWebhookEndpoint(id, config);
  }
  static async getAllWebhookEndpointAttempts(
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCWebhookEndpointAttemptType>> {
    return WebhookApiClient.getAllWebhookEndpointAttempts(id, config);
  }
  static async expireWebhookSigningSecret(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointType> {
    return WebhookApiClient.expireWebhookSigningSecret(id, config);
  }
  static async revealWebhookSigningSecret(id: number | string, config?: AxiosRequestConfig): Promise<SCWebhookEndpointSecretType> {
    return WebhookApiClient.revealWebhookSigningSecret(id, config);
  }
  static async resendWebhookEndpointEvent(id: number | string, event: number, config?: AxiosRequestConfig): Promise<any> {
    return WebhookApiClient.resendWebhookEndpointEvent(id, event, config);
  }
  static async resendMultipleWebhookEndpointEvent(id: number | string, event: number[], config?: AxiosRequestConfig): Promise<any> {
    return WebhookApiClient.resendMultipleWebhookEndpointEvent(id, event, config);
  }
}
