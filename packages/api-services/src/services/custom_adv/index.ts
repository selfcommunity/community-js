import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCCustomAdvType} from '@selfcommunity/types';
import {CustomAdvParams, SCPaginatedResponse} from '../../types';

export interface CustomAdvApiClientInterface {
  getASpecificCustomAdv(id: number, token?: string): Promise<SCCustomAdvType>;
  getAllCustomAdv(params?: CustomAdvParams, token?: string): Promise<SCPaginatedResponse<SCCustomAdvType>>;
  searchCustomAdv(params?: CustomAdvParams, token?: string): Promise<SCPaginatedResponse<SCCustomAdvType>>;
}
/**
 * Contains all the endpoints needed to manage custom advs.
 */

export class CustomAdvApiClient {
  /**
   * This endpoint retrieves a specific custom adv.
   * @param id
   * @param token
   */
  static getASpecificCustomAdv(id: number, token?: string): Promise<SCCustomAdvType> {
    return apiRequest(Endpoints.CustomAdv.url({id}), Endpoints.CustomAdv.method, token);
  }

  /**
   * This endpoint retrieves all custom advs.
   * @param params
   * @param token
   */
  static getAllCustomAdv(params?: CustomAdvParams, token?: string): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CustomAdvList.url({})}?${p.toString()}`, Endpoints.CustomAdvList.method, token);
  }

  /**
   * This endpoint performs search of a Custom Adv
   * @param params
   * @param token
   */
  static searchCustomAdv(params?: CustomAdvParams, token?: string): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CustomAdvSearch.url({})}?${p.toString()}`, Endpoints.CustomAdvSearch.method, token);
  }
}

export default class CustomAdvService {
  static async getASpecificCustomAdv(id: number, token?: string): Promise<SCCustomAdvType> {
    return CustomAdvApiClient.getASpecificCustomAdv(id, token);
  }
  static async getAllCustomAdv(params?: CustomAdvParams, token?: string): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.getAllCustomAdv(params, token);
  }
  static async searchCustomAdv(params?: CustomAdvParams, token?: string): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.searchCustomAdv(params, token);
  }
}
