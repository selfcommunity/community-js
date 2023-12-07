import Endpoints from '../../constants/Endpoints';
import {BaseGetParams, BaseSearchParams, SCPaginatedResponse} from '../../types';
import {SCCustomMenuType} from '@selfcommunity/types';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface CustomMenuApiClientInterface {
  getASpecificCustomMenu(id: number | string, config?: AxiosRequestConfig): Promise<SCCustomMenuType>;
  getAllCustomMenus(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomMenuType>>;
  getBaseCustomMenu(config?: AxiosRequestConfig): Promise<SCCustomMenuType>;
  searchCustomMenus(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomMenuType>>;
}
/**
 * Contains all the endpoints needed to manage custom menus.
 */

export class CustomMenuApiClient {
  /**
   * This endpoint retrieves a specific custom menu.
   * @param id
   * @param config
   */
  static getASpecificCustomMenu(id: number | string, config?: AxiosRequestConfig): Promise<SCCustomMenuType> {
    return apiRequest({...config, url: Endpoints.CustomMenu.url({id}), method: Endpoints.CustomMenu.method});
  }

  /**
   * This endpoint retrieves all custom menus.
   * @param params
   * @param config
   */
  static getAllCustomMenus(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomMenuType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetCustomMenus.url({})}?${p.toString()}`, method: Endpoints.GetCustomMenus.method});
  }

  /**
   * This endpoint retrieves the base custom menu.
   * @param config
   */
  static getBaseCustomMenu(config?: AxiosRequestConfig): Promise<SCCustomMenuType> {
    return apiRequest({...config, url: Endpoints.CustomMenu.url({id: 'base'}), method: Endpoints.CustomMenu.method});
  }

  /**
   * This endpoint performs search of a Custom Menu
   * @param params
   * @param config
   */
  static searchCustomMenus(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomMenuType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.CustomMenuSearch.url({})}?${p.toString()}`, method: Endpoints.CustomMenuSearch.method});
  }
}

/**
 *
 :::tip Custom Menu service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {CustomMenuService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllCustomMenus` will return the paginated list of custom menus.

 async getAllCustomMenus() {
        return await CustomMenuService.getAllCustomMenus();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getASpecificCustomMenu(customMenuId) {
        return await CustomMenuService.getASpecificCustomMenu(customMenuId);
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
export default class CustomMenuService {
  static async getASpecificCustomMenu(id: number | string, config?: AxiosRequestConfig): Promise<SCCustomMenuType> {
    return CustomMenuApiClient.getASpecificCustomMenu(id, config);
  }
  static async getAllCustomMenus(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomMenuType>> {
    return CustomMenuApiClient.getAllCustomMenus(params, config);
  }
  static async getBaseCustomMenu(config?: AxiosRequestConfig): Promise<SCCustomMenuType> {
    return CustomMenuApiClient.getBaseCustomMenu(config);
  }
  static async searchCustomMenus(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomMenuType>> {
    return CustomMenuApiClient.searchCustomMenus(params, config);
  }
}
