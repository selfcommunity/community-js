import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCPrizeType, SCPrizeUserStatusType, SCPrizeUserType} from '@selfcommunity/types';
import {SCPaginatedResponse, LoyaltyPrizeParams} from '../../types';

export interface LoyaltyApiClientInterface {
  getPrizes(): Promise<SCPaginatedResponse<SCPrizeType>>;
  createPrize(data: LoyaltyPrizeParams): Promise<SCPrizeType>;
  getSpecificPrize(id: number): Promise<SCPrizeType>;
  updatePrize(id: number, data: LoyaltyPrizeParams): Promise<SCPrizeType>;
  patchPrize(id: number, data?: LoyaltyPrizeParams): Promise<SCPrizeType>;
  getAllPrizeRequests(): Promise<SCPaginatedResponse<SCPrizeUserType>>;
  createPrizeRequest(prize: number): Promise<SCPrizeUserType>;
  getSpecificPrizeRequest(id: number): Promise<SCPrizeUserType>;
  patchPrizeRequest(id: number, status?: SCPrizeUserStatusType): Promise<SCPrizeUserType>;
}
/**
 * Contains all the endpoints needed to manage loyalty program.
 */

export class LoyaltyApiClient {
  /**
   * This endpoint retrieves all prizes.
   */
  static getPrizes(): Promise<SCPaginatedResponse<SCPrizeType>> {
    return apiRequest(Endpoints.GetPrizes.url({}), Endpoints.GetPrizes.method);
  }

  /**
   * This endpoint creates a prize.
   * @param data
   */
  static createPrize(data: LoyaltyPrizeParams): Promise<SCPrizeType> {
    return apiRequest(Endpoints.CreatePrize.url({}), Endpoints.CreatePrize.method, data);
  }

  /**
   * This endpoint retrieves a specific prize
   * @param id
   */
  static getSpecificPrize(id: number): Promise<SCPrizeType> {
    return apiRequest(Endpoints.GetSpecificPrize.url({id}), Endpoints.GetSpecificPrize.method);
  }

  /**
   * This endpoint updates a specific prize.
   * @param id
   * @param data
   */
  static updatePrize(id: number, data: LoyaltyPrizeParams): Promise<SCPrizeType> {
    return apiRequest(Endpoints.UpdatePrize.url({id}), Endpoints.UpdatePrize.method, data);
  }

  /**
   * This endpoint patches a specific prize.
   * @param id
   * @param data
   */
  static patchPrize(id: number, data?: LoyaltyPrizeParams): Promise<SCPrizeType> {
    return apiRequest(Endpoints.PatchPrize.url({id}), Endpoints.PatchPrize.method, data);
  }

  /**
   * This endpoint retrieves all requests of loyalty prizes.
   */
  static getAllPrizeRequests(): Promise<SCPaginatedResponse<SCPrizeUserType>> {
    return apiRequest(Endpoints.GetPrizeRequests.url({}), Endpoints.GetPrizeRequests.method);
  }

  /**
   * This endpoint creates a request for a loyalty prize
   * @param prize
   */
  static createPrizeRequest(prize: number): Promise<SCPrizeUserType> {
    return apiRequest(Endpoints.CreatePrizeRequest.url({}), Endpoints.CreatePrizeRequest.method, {prize: prize});
  }

  /**
   * This endpoint retrieves a specific request for a loyalty prize.
   * @param id
   */
  static getSpecificPrizeRequest(id: number): Promise<SCPrizeUserType> {
    return apiRequest(Endpoints.GetSpecificPrizeRequest.url({id}), Endpoints.GetSpecificPrizeRequest.method);
  }

  /**
   * This endpoint patches a specific request for a loyalty prize.
   * You can use this endpoint to to change status in an admin list/table interface.
   * @param id
   * @param status
   */
  static patchPrizeRequest(id: number, status?: SCPrizeUserStatusType): Promise<SCPrizeUserType> {
    return apiRequest(Endpoints.PatchPrizeRequest.url({id}), Endpoints.PatchPrizeRequest.method, {status: status});
  }
}

export default class LoyaltyService {
  /**
   *  :::tipLoyalty service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {LoyaltyService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getAllEmbeds` will return the paginated list of available prizes.
   *
   *     async getPrizes() {
   *       return await LoyaltyService.getPrizes();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async getSpecificPrize(prizeId) {
   *       return await LoyaltyService.getSpecificPrize(prizeId);
   *     }
   *  ```
   *  :::
   */
  static async getPrizes(): Promise<SCPaginatedResponse<SCPrizeType>> {
    return LoyaltyApiClient.getPrizes();
  }

  static async createPrize(data: LoyaltyPrizeParams): Promise<SCPrizeType> {
    return LoyaltyApiClient.createPrize(data);
  }

  static async getSpecificPrize(id: number): Promise<SCPrizeType> {
    return LoyaltyApiClient.getSpecificPrize(id);
  }

  static async updatePrize(id: number, data: LoyaltyPrizeParams): Promise<SCPrizeType> {
    return LoyaltyApiClient.updatePrize(id, data);
  }

  static async patchPrize(id: number, data?: LoyaltyPrizeParams): Promise<SCPrizeType> {
    return LoyaltyApiClient.patchPrize(id, data);
  }

  static async getAllPrizeRequests(): Promise<SCPaginatedResponse<SCPrizeUserType>> {
    return LoyaltyApiClient.getAllPrizeRequests();
  }

  static async createPrizeRequest(prize: number): Promise<SCPrizeUserType> {
    return LoyaltyApiClient.createPrizeRequest(prize);
  }

  static async getSpecificPrizeRequest(id: number): Promise<SCPrizeUserType> {
    return LoyaltyApiClient.getSpecificPrizeRequest(id);
  }
  static async patchPrizeRequest(id: number, status?: SCPrizeUserStatusType): Promise<SCPrizeUserType> {
    return LoyaltyApiClient.patchPrizeRequest(id, status);
  }
}
