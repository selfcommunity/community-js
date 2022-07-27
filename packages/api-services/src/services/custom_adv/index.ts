import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCCustomAdvType} from '@selfcommunity/types';
import {CustomAdvParams, SCPaginatedResponse} from '../../types';

export interface CustomAdvApiClientInterface {
  getASpecificCustomAdv(id: number): Promise<SCCustomAdvType>;
  getAllCustomAdv(params?: CustomAdvParams): Promise<SCPaginatedResponse<SCCustomAdvType>>;
  searchCustomAdv(params?: CustomAdvParams): Promise<SCPaginatedResponse<SCCustomAdvType>>;
}
/**
 * Contains all the endpoints needed to manage custom advs.
 */

export class CustomAdvApiClient {
  /**
   * This endpoint retrieves a specific custom adv.
   * @param id
   */
  static getASpecificCustomAdv(id: number): Promise<SCCustomAdvType> {
    return apiRequest(Endpoints.CustomAdv.url({id}), Endpoints.CustomAdv.method);
  }

  /**
   * This endpoint retrieves all custom advs.
   * @param params
   */
  static getAllCustomAdv(params?: CustomAdvParams): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CustomAdvList.url({})}?${p.toString()}`, Endpoints.CustomAdvList.method);
  }

  /**
   * This endpoint performs search of a Custom Adv
   * @param params
   */
  static searchCustomAdv(params?: CustomAdvParams): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CustomAdvSearch.url({})}?${p.toString()}`, Endpoints.CustomAdvSearch.method);
  }
}

/**
 *
 :::tipCustomAdv service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {CustomAdvService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllCustomAdv` will return the paginated list of advs.

 async getAllCustomAdv() {
        return await CustomAdvService.getAllCustomAdv();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getASpecificCustomAdv(customAdvId) {
        return await CustomAdvService.getASpecificCustomAdv(customAdvId);
      }
 ```
 :::
 */
export default class CustomAdvService {
  static async getASpecificCustomAdv(id: number): Promise<SCCustomAdvType> {
    return CustomAdvApiClient.getASpecificCustomAdv(id);
  }
  static async getAllCustomAdv(params?: CustomAdvParams): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.getAllCustomAdv(params);
  }
  static async searchCustomAdv(params?: CustomAdvParams): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.searchCustomAdv(params);
  }
}
