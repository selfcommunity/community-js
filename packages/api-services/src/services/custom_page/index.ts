import Endpoints from '../../constants/Endpoints';
import {CustomPageParams, CustomPageSearchParams, SCPaginatedResponse} from '../../types';
import {SCCustomPageType} from '@selfcommunity/types';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface CustomPageApiClientInterface {
  getASpecificCustomPage(id: number, config?: AxiosRequestConfig): Promise<SCCustomPageType>;
  getAllCustomPages(params?: CustomPageParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomPageType>>;
  searchCustomPages(params?: CustomPageSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomPageType>>;
}
/**
 * Contains all the endpoints needed to manage custom pages.
 */

export class CustomPageApiClient {
  /**
   * This endpoint retrieves a specific custom page.
   * @param id
   * @param config
   */
  static getASpecificCustomPage(id: number, config?: AxiosRequestConfig): Promise<SCCustomPageType> {
    return apiRequest({...config, url: Endpoints.CustomPage.url({id}), method: Endpoints.CustomPage.method});
  }

  /**
   * This endpoint retrieves all custom pages.
   * @param params
   * @param config
   */
  static getAllCustomPages(params?: CustomPageParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomPageType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetCustomPages.url({})}?${p.toString()}`, method: Endpoints.GetCustomPages.method});
  }

  /**
   * This endpoint performs search of a Custom Page
   * @param params
   * @param config
   */
  static searchCustomPages(params?: CustomPageSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomPageType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.CustomPageSearch.url({})}?${p.toString()}`, method: Endpoints.CustomPageSearch.method});
  }
}

/**
 *
 :::tipCustom Page service can be used in the following way:

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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class CustomPageService {
  static async getASpecificCustomPage(id: number, config?: AxiosRequestConfig): Promise<SCCustomPageType> {
    return CustomPageApiClient.getASpecificCustomPage(id, config);
  }
  static async getAllCustomPages(params?: CustomPageParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.getAllCustomPages(params, config);
  }
  static async searchCustomPages(params?: CustomPageSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.searchCustomPages(params, config);
  }
}
