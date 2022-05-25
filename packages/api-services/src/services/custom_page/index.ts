import Endpoints from '../../constants/Endpoints';
import {SCPaginatedResponse} from '../../types';
import {SCCustomPageType} from '@selfcommunity/types/src/types';
import {apiRequest} from '../../utils/apiRequest';

export interface CustomPageApiClientInterface {
  getASpecificCustomPage(id: number): Promise<SCCustomPageType>;
  getAllCustomPages(): Promise<SCPaginatedResponse<SCCustomPageType>>;
  searchCustomPages(): Promise<SCPaginatedResponse<SCCustomPageType>>;
}

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
   */
  static getAllCustomPages(): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return apiRequest(Endpoints.GetCustomPages.url({}), Endpoints.GetCustomPages.method);
  }

  /**
   * This endpoint performs search of a Custom Page
   */
  static searchCustomPages(): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return apiRequest(Endpoints.CustomPageSearch.url({}), Endpoints.CustomPageSearch.method);
  }
}

export default class CustomPageService {
  static async getASpecificCustomPage(id: number): Promise<SCCustomPageType> {
    return CustomPageApiClient.getASpecificCustomPage(id);
  }
  static async getAllCustomPages(): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.getAllCustomPages();
  }
  static async searchCustomPages(): Promise<SCPaginatedResponse<SCCustomPageType>> {
    return CustomPageApiClient.searchCustomPages();
  }
}
