import {IncubatorCreateParams, IncubatorSearchParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCIncubatorSubscriptionType, SCIncubatorType, SCUserType} from '@selfcommunity/types';

export interface IncubatorApiClientInterface {
  getAllIncubators(params?: IncubatorSearchParams): Promise<SCPaginatedResponse<SCIncubatorType>>;
  searchIncubators(params?: IncubatorSearchParams): Promise<SCPaginatedResponse<SCIncubatorType>>;
  getSpecificIncubator(id: number): Promise<SCIncubatorType>;
  createIncubator(data: IncubatorCreateParams): Promise<SCIncubatorType>;
  getIncubatorSubscribers(id: number): Promise<SCPaginatedResponse<SCUserType>>;
  subscribeToIncubator(id: number): Promise<any>;
  checkIncubatorSubscription(id: number): Promise<SCIncubatorSubscriptionType>;
}
/**
 * Contains all the endpoints needed to manage incubators.
 */

export class IncubatorApiClient {
  /**
   * This endpoint retrieves all incubators.
   * @param params
   */
  static getAllIncubators(params?: IncubatorSearchParams): Promise<SCPaginatedResponse<SCIncubatorType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.GetAllIncubators.url({})}?${p.toString()}`, Endpoints.GetAllIncubators.method);
  }

  /**
   * This endpoint performs search od Incubators
   * @param params
   */
  static searchIncubators(params?: IncubatorSearchParams): Promise<SCPaginatedResponse<SCIncubatorType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.SearchIncubators.url({})}?${p.toString()}`, Endpoints.SearchIncubators.method);
  }

  /**
   * This endpoint retrieves a specific incubator.
   * @param id
   */
  static getSpecificIncubator(id: number): Promise<SCIncubatorType> {
    return apiRequest(Endpoints.GetASpecificIncubator.url({id}), Endpoints.GetASpecificIncubator.method);
  }

  /**
   * This endpoint creates an incubator.
   * @param data
   */
  static createIncubator(data: IncubatorCreateParams): Promise<SCIncubatorType> {
    return apiRequest(Endpoints.CreateAnIncubator.url({}), Endpoints.CreateAnIncubator.method, data);
  }

  /**
   * This endpoint returns all subscribers of a specific incubator.
   * @param id
   */
  static getIncubatorSubscribers(id: number): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.GetIncubatorSubscribers.url({id}), Endpoints.GetIncubatorSubscribers.method);
  }

  /**
   * This endpoint subscribes to an incubator.
   * @param id
   */
  static subscribeToIncubator(id: number): Promise<any> {
    return apiRequest(Endpoints.SubscribeToIncubator.url({id}), Endpoints.SubscribeToIncubator.method);
  }

  /**
   * This endpoint returns subscribed = true if the incubator (identified in path) is subscribed by the authenticated user.
   * @param id
   */
  static checkIncubatorSubscription(id: number): Promise<SCIncubatorSubscriptionType> {
    return apiRequest(Endpoints.CheckIncubatorSubscription.url({id}), Endpoints.CheckIncubatorSubscription.method);
  }
}

export default class IncubatorService {
  /**
   *  :::tipIncubator service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {IncubatorService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getAllIncubators` will return the paginated list of incubators.
   *
   *     async getAllIncubators() {
   *       return await IncubatorService.getAllIncubators();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async getSpecificIncubator(incubatorId) {
   *       return await IncubatorService.getSpecificIncubator(incubatorId);
   *     }
   *  ```
   *  :::
   */
  static async getAllIncubators(params?: IncubatorSearchParams): Promise<SCPaginatedResponse<SCIncubatorType>> {
    return IncubatorApiClient.getAllIncubators(params);
  }

  static async searchIncubators(params?: IncubatorSearchParams): Promise<SCPaginatedResponse<SCIncubatorType>> {
    return IncubatorApiClient.searchIncubators(params);
  }

  static async getSpecificIncubator(id: number): Promise<SCIncubatorType> {
    return IncubatorApiClient.getSpecificIncubator(id);
  }
  static async createIncubator(data: IncubatorCreateParams): Promise<SCIncubatorType> {
    return IncubatorApiClient.createIncubator(data);
  }

  static async getIncubatorSubscribers(id: number): Promise<SCPaginatedResponse<SCUserType>> {
    return IncubatorApiClient.getIncubatorSubscribers(id);
  }

  static async subscribeToIncubator(id: number): Promise<any> {
    return IncubatorApiClient.subscribeToIncubator(id);
  }

  static async checkIncubatorSubscription(id: number): Promise<SCIncubatorSubscriptionType> {
    return IncubatorApiClient.checkIncubatorSubscription(id);
  }
}
