import Endpoints from '../../constants/Endpoints';
import {CustomPageParams, CustomPageSearchParams, SCPaginatedResponse} from '../../types';
import {SCCustomPageType} from '@selfcommunity/types';
import {apiRequest} from '../../utils/apiRequest';

export interface CustomPageApiClientInterface {
  getASpecificCustomPage(id: number): Promise<SCCustomPageType>;
  getAllCustomPages(params?: CustomPageParams): Promise<SCPaginatedResponse<SCCustomPageType>>;
  searchCustomPages(params?: CustomPageSearchParams): Promise<SCPaginatedResponse<SCCustomPageType>>;
}
/**
 * Contains all the endpoints needed to manage custom pages.
 */

export class CustomPageApiClient {
  /**
   * This endpoint retrieves a specific custom page.
   * @param id
   */
  static getASpecificCustomPage(id: number): Promise<SCCustomPageType> {
    return apiRequest(Endpoints.CustomPage.url({id}), Endpoints.CustomPage.method);
  }

  /**
   * This endpoint retrieves all custom pages.
   * @param params
   */
  static getAllCustomPages(params?: CustomPageParams): Promise<SCPaginatedResponse<SCCustomPageType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.GetCustomPages.url({})}?${p.toString()}`, Endpoints.GetCustomPages.method);
  }

  /**
   * This endpoint performs search of a Custom Page
   * @param params
   */
  static searchCustomPages(params?: CustomPageSearchParams): Promise<SCPaginatedResponse<SCCustomPageType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CustomPageSearch.url({})}?${p.toString()}`, Endpoints.CustomPageSearch.method);
  }
}

/**
 *
 :::tipCustom Page service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {CustomPageService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllCustomPages` will return the paginated list of custom pages.

 async getAllCustomPages() {
        return await CustomPageService.getAllCustomPages();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getASpecificCustomPage(customPageId) {
        return await CustomPageService.getASpecificCustomPage(customPageId);
     }
 ```
 :::
 */
export default class CustomPageService {
  static async getASpecificCustomPage(id: number): Promise<SCCustomPageType> {
    return CustomPageApiClient.getASpecificCustomPage(id);
  }
  static async getAllCustomPages(params?: CustomPageParams): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.getAllCustomPages(params);
  }
  static async searchCustomPages(params?: CustomPageSearchParams): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.searchCustomPages(params);
  }
}
