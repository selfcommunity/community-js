import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCPreferenceType} from '@selfcommunity/types/src/types';
import {SCPaginatedResponse} from '../../types';

export interface PreferenceApiClientInterface {
  getAllPreferences(): Promise<SCPaginatedResponse<SCPreferenceType[]>>;
  searchPreferences(search?: string, section?: string, keys?: string, ordering?: string): Promise<SCPaginatedResponse<SCPreferenceType[]>>;
  getSpecificPreference(id: number): Promise<SCPreferenceType>;
}
/**
 * Contains all the endpoints needed to manage dynamic preferences.
 */

export class PreferenceApiClient {
  /**
   * This endpoint retrieves all available dynamic preferences.
   */
  static getAllPreferences(): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    return apiRequest(Endpoints.Preferences.url({}), Endpoints.Preferences.method);
  }

  /**
   * This endpoint searches dynamic preferences.
   * @param search
   * @param section
   * @param keys
   * @param ordering
   */
  static searchPreferences(search?: string, section?: string, keys?: string, ordering?: string): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    const params = new URLSearchParams({
      ...(search && {search: search}),
      ...(section && {section: section}),
      ...(keys && {keys: keys}),
      ...(ordering && {ordering: ordering})
    });
    return apiRequest(`${Endpoints.Preferences.url({})}?${params.toString()}`, Endpoints.Preferences.method);
  }

  /**
   * This endpoint retrieves a specific dynamic preference.
   * @param id
   */
  static getSpecificPreference(id: number): Promise<SCPreferenceType> {
    return apiRequest(Endpoints.GetPreference.url({id}), Endpoints.Preferences.method);
  }
}

export default class PreferenceService {
  static async getAllPreferences(): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    return PreferenceApiClient.getAllPreferences();
  }

  static async searchPreferences(
    search?: string,
    section?: string,
    keys?: string,
    ordering?: string
  ): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    return PreferenceApiClient.searchPreferences(search, section, keys, ordering);
  }

  static async getSpecificPreference(id: number): Promise<SCPreferenceType> {
    return PreferenceApiClient.getSpecificPreference(id);
  }
}
