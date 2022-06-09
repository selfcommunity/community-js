import Endpoints from '../../constants/Endpoints';
import {BaseSearchParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLocalityType} from '@selfcommunity/types';

export interface LocalityApiClientInterface {
  getLocalities(params?: BaseSearchParams): Promise<SCPaginatedResponse<SCLocalityType>>;
  searchLocalities(params?: BaseSearchParams): Promise<SCPaginatedResponse<SCLocalityType>>;
}
/**
 * Contains all the endpoints needed to manage localities.
 */

export class LocalityApiClient {
  /**
   * This endpoint retrieves the list of available localities.
   * @param params
   */
  static getLocalities(params?: BaseSearchParams): Promise<SCPaginatedResponse<SCLocalityType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.GetLocalities.url({})}?${p.toString()}`, Endpoints.GetLocalities.method);
  }

  /**
   * This endpoint searches localities
   * @param params
   */
  static searchLocalities(params?: BaseSearchParams): Promise<SCPaginatedResponse<SCLocalityType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.ComposerLocalitySearch.url({})}?${p.toString()}`, Endpoints.ComposerLocalitySearch.method);
  }
}

export default class LocalityService {
  static async getLocalities(params?: BaseSearchParams): Promise<SCPaginatedResponse<SCLocalityType>> {
    return LocalityApiClient.getLocalities(params);
  }
  static async searchLocalities(params?: BaseSearchParams): Promise<SCPaginatedResponse<SCLocalityType>> {
    return LocalityApiClient.searchLocalities(params);
  }
}
