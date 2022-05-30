import Endpoints from '../../constants/Endpoints';
import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLocalityType} from '@selfcommunity/types';

export interface LocalityApiClientInterface {
  getLocalities(): Promise<SCPaginatedResponse<SCLocalityType>>;
  searchLocalities(): Promise<SCPaginatedResponse<SCLocalityType>>;
}
/**
 * Contains all the endpoints needed to manage localities.
 */

export class LocalityApiClient {
  /**
   * This endpoint retrieves the list of available localities.
   */
  static getLocalities(): Promise<SCPaginatedResponse<SCLocalityType>> {
    return apiRequest(Endpoints.GetLocalities.url({}), Endpoints.GetLocalities.method);
  }

  /**
   * This endpoint searches localities
   */
  static searchLocalities(): Promise<SCPaginatedResponse<SCLocalityType>> {
    return apiRequest(Endpoints.ComposerLocalitySearch.url({}), Endpoints.ComposerLocalitySearch.method);
  }
}

export default class LocalityService {
  static async getLocalities(): Promise<SCPaginatedResponse<SCLocalityType>> {
    return LocalityApiClient.getLocalities();
  }
  static async searchLocalities(): Promise<SCPaginatedResponse<SCLocalityType>> {
    return LocalityApiClient.searchLocalities();
  }
}
