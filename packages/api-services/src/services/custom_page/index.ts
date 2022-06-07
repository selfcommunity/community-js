import Endpoints from '../../constants/Endpoints';
import {CustomPageParams, CustomPageSearchParams, SCPaginatedResponse} from '../../types';
import {SCCustomPageType} from '@selfcommunity/types';
import {apiRequest} from '../../utils/apiRequest';

export interface CustomPageApiClientInterface {
  getASpecificCustomPage(id: number, token?: string): Promise<SCCustomPageType>;
  getAllCustomPages(params?: CustomPageParams, token?: string): Promise<SCPaginatedResponse<SCCustomPageType>>;
  searchCustomPages(params?: CustomPageSearchParams, token?: string): Promise<SCPaginatedResponse<SCCustomPageType>>;
}
/**
 * Contains all the endpoints needed to manage custom pages.
 */

export class CustomPageApiClient {
  /**
   * This endpoint retrieves a specific custom page.
   * @param id
   * @param token
   */
  static getASpecificCustomPage(id: number, token?: string): Promise<SCCustomPageType> {
    return apiRequest(Endpoints.CustomPage.url({id}), Endpoints.CustomPage.method, token);
  }

  /**
   * This endpoint retrieves all custom pages.
   * @param params
   * @param token
   */
  static getAllCustomPages(params?: CustomPageParams, token?: string): Promise<SCPaginatedResponse<SCCustomPageType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.GetCustomPages.url({})}?${p.toString()}`, Endpoints.GetCustomPages.method, token);
  }

  /**
   * This endpoint performs search of a Custom Page
   * @param params
   * @param token
   */
  static searchCustomPages(params?: CustomPageSearchParams, token?: string): Promise<SCPaginatedResponse<SCCustomPageType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CustomPageSearch.url({})}?${p.toString()}`, Endpoints.CustomPageSearch.method, token);
  }
}

export default class CustomPageService {
  static async getASpecificCustomPage(id: number, token?: string): Promise<SCCustomPageType> {
    return CustomPageApiClient.getASpecificCustomPage(id, token);
  }
  static async getAllCustomPages(params?: CustomPageParams, token?: string): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.getAllCustomPages(params, token);
  }
  static async searchCustomPages(params?: CustomPageSearchParams, token?: string): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.searchCustomPages(params, token);
  }
}
