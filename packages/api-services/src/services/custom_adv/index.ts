import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCCustomAdvType} from '@selfcommunity/types';
import {SCPaginatedResponse} from '../../types';

export interface CustomAdvApiClientInterface {
  getASpecificCustomAdv(id: number): Promise<SCPaginatedResponse<SCCustomAdvType>>;
  getAllCustomAdv(): Promise<SCPaginatedResponse<SCCustomAdvType>>;
  searchCustomAdv(): Promise<SCPaginatedResponse<SCCustomAdvType>>;
}
/**
 * Contains all the endpoints needed to manage custom advs.
 */

export class CustomAdvApiClient {
  /**
   * This endpoint retrieves a specific custom adv.
   * @param id
   */
  static getASpecificCustomAdv(id: number): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return apiRequest(Endpoints.CustomAdv.url({id}), Endpoints.CustomAdv.method);
  }

  /**
   * This endpoint retrieves all custom advs.
   */
  static getAllCustomAdv(): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return apiRequest(Endpoints.CustomAdvList.url({}), Endpoints.CustomAdvList.method);
  }

  /**
   * This endpoint performs search of a Custom Adv
   */
  static searchCustomAdv(): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return apiRequest(Endpoints.CustomAdvSearch.url({}), Endpoints.CustomAdvSearch.method);
  }
}

export default class CustomAdvService {
  static async getASpecificCustomAdv(id: number): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.getASpecificCustomAdv(id);
  }
  static async getAllCustomAdv(): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.getAllCustomAdv();
  }
  static async searchCustomAdv(): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.searchCustomAdv();
  }
}
