import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCPrizeType, SCPrizeUserStatusType, SCPrizeUserType} from '@selfcommunity/types';
import {SCPaginatedResponse, LoyaltyPrizeParams} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface LoyaltyApiClientInterface {
  getPrizes(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrizeType>>;
  createPrize(data: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType>;
  getSpecificPrize(id: number | string, config?: AxiosRequestConfig): Promise<SCPrizeType>;
  updatePrize(id: number | string, data: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType>;
  patchPrize(id: number | string, data?: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType>;
  getAllPrizeRequests(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrizeUserType>>;
  createPrizeRequest(prize: number, config?: AxiosRequestConfig): Promise<SCPrizeUserType>;
  getSpecificPrizeRequest(id: number | string, config?: AxiosRequestConfig): Promise<SCPrizeUserType>;
  patchPrizeRequest(id: number | string, status?: SCPrizeUserStatusType, config?: AxiosRequestConfig): Promise<SCPrizeUserType>;
}
/**
 * Contains all the endpoints needed to manage loyalty program.
 */

export class LoyaltyApiClient {
  /**
   * This endpoint retrieves all prizes.
   * @param config
   */
  static getPrizes(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrizeType>> {
    return apiRequest({...config, url: Endpoints.GetPrizes.url({}), method: Endpoints.GetPrizes.method});
  }

  /**
   * This endpoint creates a prize.
   * @param data
   * @param config
   */
  static createPrize(data: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return apiRequest({...config, url: Endpoints.CreatePrize.url({}), method: Endpoints.CreatePrize.method, data: data});
  }

  /**
   * This endpoint retrieves a specific prize
   * @param id
   * @param config
   */
  static getSpecificPrize(id: number | string, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return apiRequest({...config, url: Endpoints.GetSpecificPrize.url({id}), method: Endpoints.GetSpecificPrize.method});
  }

  /**
   * This endpoint updates a specific prize.
   * @param id
   * @param data
   * @param config
   */
  static updatePrize(id: number | string, data: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return apiRequest({...config, url: Endpoints.UpdatePrize.url({id}), method: Endpoints.UpdatePrize.method, data: data});
  }

  /**
   * This endpoint patches a specific prize.
   * @param id
   * @param data
   * @param config
   */
  static patchPrize(id: number | string, data?: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return apiRequest({...config, url: Endpoints.PatchPrize.url({id}), method: Endpoints.PatchPrize.method, data: data});
  }

  /**
   * This endpoint retrieves all requests of loyalty prizes.
   * @param config
   */
  static getAllPrizeRequests(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrizeUserType>> {
    return apiRequest({...config, url: Endpoints.GetPrizeRequests.url({}), method: Endpoints.GetPrizeRequests.method});
  }

  /**
   * This endpoint creates a request for a loyalty prize
   * @param prize
   * @param config
   */
  static createPrizeRequest(prize: number, config?: AxiosRequestConfig): Promise<SCPrizeUserType> {
    return apiRequest({...config, url: Endpoints.CreatePrizeRequest.url({}), method: Endpoints.CreatePrizeRequest.method, data: {prize: prize}});
  }

  /**
   * This endpoint retrieves a specific request for a loyalty prize.
   * @param id
   * @param config
   */
  static getSpecificPrizeRequest(id: number | string, config?: AxiosRequestConfig): Promise<SCPrizeUserType> {
    return apiRequest({...config, url: Endpoints.GetSpecificPrizeRequest.url({id}), method: Endpoints.GetSpecificPrizeRequest.method});
  }

  /**
   * This endpoint patches a specific request for a loyalty prize.
   * You can use this endpoint to change status in an admin list/table interface.
   * @param id
   * @param status
   * @param config
   */
  static patchPrizeRequest(id: number | string, status?: SCPrizeUserStatusType, config?: AxiosRequestConfig): Promise<SCPrizeUserType> {
    return apiRequest({...config, url: Endpoints.PatchPrizeRequest.url({id}), method: Endpoints.PatchPrizeRequest.method, data: {status: status}});
  }
}

/**
 *
 :::tipLoyalty service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {LoyaltyService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getPrizes` will return the paginated list of available prizes.

 async getPrizes() {
        return await LoyaltyService.getPrizes();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificPrize(prizeId) {
       return await LoyaltyService.getSpecificPrize(prizeId);
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
export default class LoyaltyService {
  static async getPrizes(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrizeType>> {
    return LoyaltyApiClient.getPrizes(config);
  }

  static async createPrize(data: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return LoyaltyApiClient.createPrize(data, config);
  }

  static async getSpecificPrize(id: number | string, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return LoyaltyApiClient.getSpecificPrize(id, config);
  }

  static async updatePrize(id: number | string, data: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return LoyaltyApiClient.updatePrize(id, data, config);
  }

  static async patchPrize(id: number | string, data?: LoyaltyPrizeParams, config?: AxiosRequestConfig): Promise<SCPrizeType> {
    return LoyaltyApiClient.patchPrize(id, data, config);
  }

  static async getAllPrizeRequests(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrizeUserType>> {
    return LoyaltyApiClient.getAllPrizeRequests(config);
  }

  static async createPrizeRequest(prize: number, config?: AxiosRequestConfig): Promise<SCPrizeUserType> {
    return LoyaltyApiClient.createPrizeRequest(prize, config);
  }

  static async getSpecificPrizeRequest(id: number | string, config?: AxiosRequestConfig): Promise<SCPrizeUserType> {
    return LoyaltyApiClient.getSpecificPrizeRequest(id, config);
  }
  static async patchPrizeRequest(id: number | string, status?: SCPrizeUserStatusType, config?: AxiosRequestConfig): Promise<SCPrizeUserType> {
    return LoyaltyApiClient.patchPrizeRequest(id, status, config);
  }
}
