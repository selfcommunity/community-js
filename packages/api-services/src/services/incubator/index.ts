import {IncubatorCreateParams, IncubatorSearchParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCIncubatorSubscriptionType, SCIncubatorType, SCUserType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';

export interface IncubatorApiClientInterface {
  getAllIncubators(params?: IncubatorSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>>;
  searchIncubators(params?: IncubatorSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>>;
  getSpecificIncubator(id: number, config?: AxiosRequestConfig): Promise<SCIncubatorType>;
  createIncubator(data: IncubatorCreateParams, config?: AxiosRequestConfig): Promise<SCIncubatorType>;
  getIncubatorSubscribers(id: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  subscribeToIncubator(id: number, config?: AxiosRequestConfig): Promise<any>;
  checkIncubatorSubscription(id: number, config?: AxiosRequestConfig): Promise<SCIncubatorSubscriptionType>;
}
/**
 * Contains all the endpoints needed to manage incubators.
 */

export class IncubatorApiClient {
  /**
   * This endpoint retrieves all incubators.
   * @param params
   * @param config
   */
  static getAllIncubators(params?: IncubatorSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.GetAllIncubators.url({})}?${p.toString()}`, method: Endpoints.GetAllIncubators.method});
  }

  /**
   * This endpoint performs search od Incubators
   * @param params
   * @param config
   */
  static searchIncubators(params?: IncubatorSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchIncubators.url({})}?${p.toString()}`, method: Endpoints.SearchIncubators.method});
  }

  /**
   * This endpoint retrieves a specific incubator.
   * @param id
   * @param config
   */
  static getSpecificIncubator(id: number, config?: AxiosRequestConfig): Promise<SCIncubatorType> {
    return apiRequest({...config, url: Endpoints.GetASpecificIncubator.url({id}), method: Endpoints.GetASpecificIncubator.method});
  }

  /**
   * This endpoint creates an incubator.
   * @param data
   * @param config
   */
  static createIncubator(data: IncubatorCreateParams, config?: AxiosRequestConfig): Promise<SCIncubatorType> {
    return apiRequest({...config, url: Endpoints.CreateAnIncubator.url({}), method: Endpoints.CreateAnIncubator.method, data: data});
  }

  /**
   * This endpoint returns all subscribers of a specific incubator.
   * @param id
   * @param config
   */
  static getIncubatorSubscribers(id: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.GetIncubatorSubscribers.url({id}), method: Endpoints.GetIncubatorSubscribers.method});
  }

  /**
   * This endpoint subscribes to an incubator.
   * @param id
   * @param config
   */
  static subscribeToIncubator(id: number, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.SubscribeToIncubator.url({id}), method: Endpoints.SubscribeToIncubator.method});
  }

  /**
   * This endpoint returns subscribed = true if the incubator (identified in path) is subscribed by the authenticated user.
   * @param id
   * @param config
   */
  static checkIncubatorSubscription(id: number, config?: AxiosRequestConfig): Promise<SCIncubatorSubscriptionType> {
    return apiRequest({...config, url: Endpoints.CheckIncubatorSubscription.url({id}), method: Endpoints.CheckIncubatorSubscription.method});
  }
}

/**
 *
 :::tipIncubator service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {IncubatorService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllIncubators` will return the paginated list of incubators.

 async getAllIncubators() {
         return await IncubatorService.getAllIncubators();
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificIncubator(incubatorId) {
         return await IncubatorService.getSpecificIncubator(incubatorId);
       }
 ```
 :::
 */
export default class IncubatorService {
  static async getAllIncubators(params?: IncubatorSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>> {
    return IncubatorApiClient.getAllIncubators(params, config);
  }

  static async searchIncubators(params?: IncubatorSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>> {
    return IncubatorApiClient.searchIncubators(params, config);
  }

  static async getSpecificIncubator(id: number, config?: AxiosRequestConfig): Promise<SCIncubatorType> {
    return IncubatorApiClient.getSpecificIncubator(id, config);
  }
  static async createIncubator(data: IncubatorCreateParams, config?: AxiosRequestConfig): Promise<SCIncubatorType> {
    return IncubatorApiClient.createIncubator(data, config);
  }

  static async getIncubatorSubscribers(id: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return IncubatorApiClient.getIncubatorSubscribers(id, config);
  }

  static async subscribeToIncubator(id: number, config?: AxiosRequestConfig): Promise<any> {
    return IncubatorApiClient.subscribeToIncubator(id, config);
  }

  static async checkIncubatorSubscription(id: number, config?: AxiosRequestConfig): Promise<SCIncubatorSubscriptionType> {
    return IncubatorApiClient.checkIncubatorSubscription(id, config);
  }
}
