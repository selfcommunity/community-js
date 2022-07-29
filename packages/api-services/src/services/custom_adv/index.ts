import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCCustomAdvType} from '@selfcommunity/types';
import {CustomAdvParams, SCPaginatedResponse} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface CustomAdvApiClientInterface {
  getASpecificCustomAdv(id: number, config?: AxiosRequestConfig): Promise<SCCustomAdvType>;
  getAllCustomAdv(params?: CustomAdvParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomAdvType>>;
  searchCustomAdv(params?: CustomAdvParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomAdvType>>;
}
/**
 * Contains all the endpoints needed to manage custom advs.
 */

export class CustomAdvApiClient {
  /**
   * This endpoint retrieves a specific custom adv.
   * @param id
   * @param config
   */
  static getASpecificCustomAdv(id: number, config?: AxiosRequestConfig): Promise<SCCustomAdvType> {
    return apiRequest({...config, url: Endpoints.CustomAdv.url({id}), method: Endpoints.CustomAdv.method});
  }

  /**
   * This endpoint retrieves all custom advs.
   * @param params
   * @param config
   */
  static getAllCustomAdv(params?: CustomAdvParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.CustomAdvList.url({})}?${p.toString()}`, method: Endpoints.CustomAdvList.method});
  }

  /**
   * This endpoint performs search of a Custom Adv
   * @param params
   * @param config
   */
  static searchCustomAdv(params?: CustomAdvParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.CustomAdvSearch.url({})}?${p.toString()}`, method: Endpoints.CustomAdvSearch.method});
  }
}

/**
 *
 :::tipCustom Adv service can be used in the following way:

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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class CustomAdvService {
  static async getASpecificCustomAdv(id: number, config?: AxiosRequestConfig): Promise<SCCustomAdvType> {
    return CustomAdvApiClient.getASpecificCustomAdv(id, config);
  }
  static async getAllCustomAdv(params?: CustomAdvParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.getAllCustomAdv(params, config);
  }
  static async searchCustomAdv(params?: CustomAdvParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomAdvType>> {
    return CustomAdvApiClient.searchCustomAdv(params, config);
  }
}
