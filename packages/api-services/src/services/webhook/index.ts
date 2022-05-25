import Endpoints from '../../constants/Endpoints';
import {SCWebhookEndpointType, SCWebhookEndpointAttemptType, SCWebhookEndpointSecretType} from '@selfcommunity/types';
import {WebhookParamType} from '../../types';
import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';

export interface WebhookApiClientInterface {
  getAllWebhookEndpoints(): Promise<SCPaginatedResponse<SCWebhookEndpointType>>;
  getAllWebhookEvents(): Promise<string[]>;
  createWebhookEndpoint(params: WebhookParamType): Promise<SCWebhookEndpointType>;
  getASpecificWebhookEndpoint(id: number): Promise<SCWebhookEndpointType>;
  updateASpecificWebhookEndpoint(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType>;
  updateASingleWebhookEndpointField(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType>;
  deleteWebhookEndpoint(id: number): Promise<any>;
  getAllWebhookEndpointAttempts(id: number): Promise<SCPaginatedResponse<SCWebhookEndpointAttemptType>>;
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
  static getAllWebhookEndpoints(): Promise<SCPaginatedResponse<SCWebhookEndpointType>> {
    return apiRequest(Endpoints.WebhookEndpointsList.url({}), Endpoints.WebhookEndpointsList.method);
  }

  /**
   * This endpoint retrieves webhook events that can be enabled in the endpoint.
   */
  static getAllWebhookEvents(): Promise<string[]> {
    return apiRequest(Endpoints.WebhookEventsList.url({}), Endpoints.WebhookEventsList.method);
  }

  /**
   * This endpoint creates a webhook endpoint and connects it to the given webhook events.
   * @param data
   */
  static createWebhookEndpoint(data: WebhookParamType): Promise<SCWebhookEndpointType> {
    return apiRequest(Endpoints.WebhookCreate.url({}), Endpoints.WebhookCreate.method, data);
  }

  /**
   * This endpoint retrieves a specific webhook endpoint using ID.
   * @param id
   */
  static getASpecificWebhookEndpoint(id: number): Promise<SCWebhookEndpointType> {
    return apiRequest(Endpoints.GetSpecificWebhook.url({id}), Endpoints.GetSpecificWebhook.method);
  }

  /**
   * This endpoint updates a specific webhook endpoint.
   * @param id
   * @param params
   */
  static updateASpecificWebhookEndpoint(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType> {
    return apiRequest(Endpoints.WebhookUpdate.url({id}), Endpoints.WebhookUpdate.method, params);
  }

  /**
   * This endpoint updates a specific field for a specific webhook endpoint.
   * @param id
   * @param params
   */
  static updateASingleWebhookEndpointField(id: number, params: WebhookParamType): Promise<SCWebhookEndpointType> {
    return apiRequest(Endpoints.WebhookPatch.url({id}), Endpoints.WebhookPatch.method, params);
  }

  /**
   * This endpoint deletes a Webhook Endpoint.
   * @param id
   */
  static deleteWebhookEndpoint(id: number): Promise<any> {
    return apiRequest(Endpoints.WebhookDelete.url({id}), Endpoints.WebhookDelete.method);
  }

  /**
   * This endpoint retrieves the attempts related to this endpoint.
   * @param id
   */
  static getAllWebhookEndpointAttempts(id: number): Promise<SCPaginatedResponse<SCWebhookEndpointAttemptType>> {
    return apiRequest(Endpoints.WebhookEndpointAttempts.url({id}), Endpoints.WebhookEndpointAttempts.method);
  }

  /**
   * This endpoint expires the secret associated with this endpoint.
   * @param id
   */
  static expireWebhookSigningSecret(id: number): Promise<SCWebhookEndpointType> {
    return apiRequest(Endpoints.WebhookExpireSigningSecret.url({id}), Endpoints.WebhookExpireSigningSecret.method);
  }

  /**
   * This endpoint reveals the secret associated with this endpoint.
   * @param id
   * @param password
   */
  static revealWebhookSigningSecret(id: number, password?: string): Promise<SCWebhookEndpointSecretType> {
    return apiRequest(
      Endpoints.WebhookRevealSigningSecret.url({id}),
      Endpoints.WebhookRevealSigningSecret.method,
      password ? {password: password} : null
    );
  }

  /**
   * This endpoint resends the event specified as parameter to the endpoint specified by the id parameter.
   * @param id
   * @param event
   */
  static resendWebhookEndpointEvent(id: number, event: number): Promise<any> {
    return apiRequest(Endpoints.WebhookResendEndpointEvent.url({id}), Endpoints.WebhookResendEndpointEvent.method, {event: event});
  }

  /**
   * This endpoint resends the events specified as parameters to the endpoint specified by the id parameter.
   * @param id
   * @param event
   */
  static resendMultipleWebhookEndpointEvent(id: number, event: number[]): Promise<any> {
    return apiRequest(Endpoints.WebhookResendMultipleEndpointEvent.url({id}), Endpoints.WebhookResendMultipleEndpointEvent.method, {event: event});
  }
}

export default class WebhookService {
  static async getAllWebhookEndpoints(): Promise<SCPaginatedResponse<SCWebhookEndpointType>> {
    return WebhookApiClient.getAllWebhookEndpoints();
  }
  static async getAllWebhookEvents(): Promise<any> {
    return WebhookApiClient.getAllWebhookEvents();
  }
  static async createWebhookEndpoint(params: WebhookParamType): Promise<SCWebhookEndpointType> {
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
  static async getAllWebhookEndpointAttempts(id: number): Promise<SCPaginatedResponse<SCWebhookEndpointAttemptType>> {
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
