import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCPreferenceType} from '@selfcommunity/types/src/types';
import {SCPaginatedResponse} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface PreferenceApiClientInterface {
  getAllPreferences(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPreferenceType[]>>;
  searchPreferences(
    search?: string,
    section?: string,
    keys?: string,
    ordering?: string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPreferenceType[]>>;
  getSpecificPreference(id: number, config?: AxiosRequestConfig): Promise<SCPreferenceType>;
}
/**
 * Contains all the endpoints needed to manage dynamic preferences.
 */

export class PreferenceApiClient {
  /**
   * This endpoint retrieves all available dynamic preferences.
   * @param config
   */
  static getAllPreferences(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    return apiRequest({...config, url: Endpoints.Preferences.url({}), method: Endpoints.Preferences.method});
  }

  /**
   * This endpoint searches dynamic preferences.
   * @param search
   * @param section
   * @param keys
   * @param ordering
   * @param config
   */
  static searchPreferences(
    search?: string,
    section?: string,
    keys?: string,
    ordering?: string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    const params = new URLSearchParams({
      ...(search && {search: search}),
      ...(section && {section: section}),
      ...(keys && {keys: keys}),
      ...(ordering && {ordering: ordering})
    });
    return apiRequest({...config, url: `${Endpoints.Preferences.url({})}?${params.toString()}`, method: Endpoints.Preferences.method});
  }

  /**
   * This endpoint retrieves a specific dynamic preference.
   * @param id
   * @param config
   */
  static getSpecificPreference(id: number, config?: AxiosRequestConfig): Promise<SCPreferenceType> {
    return apiRequest({...config, url: Endpoints.GetPreference.url({id}), method: Endpoints.Preferences.method});
  }
}

/**
 *
 :::tipPreference service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {PreferenceService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllPreferences` will return the paginated list of preferences.

 async getAllPreferences() {
        return await PreferenceService.getAllPreferences();
     }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificPreference(preferenceId) {
        return await PreferenceService.getSpecificPreference(preferenceId);
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
export default class PreferenceService {
  static async getAllPreferences(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    return PreferenceApiClient.getAllPreferences(config);
  }

  static async searchPreferences(
    search?: string,
    section?: string,
    keys?: string,
    ordering?: string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPreferenceType[]>> {
    return PreferenceApiClient.searchPreferences(search, section, keys, ordering, config);
  }

  static async getSpecificPreference(id: number, config?: AxiosRequestConfig): Promise<SCPreferenceType> {
    return PreferenceApiClient.getSpecificPreference(id, config);
  }
}
