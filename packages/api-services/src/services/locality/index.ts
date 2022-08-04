import Endpoints from '../../constants/Endpoints';
import {BaseSearchParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLocalityType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface LocalityApiClientInterface {
  getLocalities(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLocalityType>>;
  searchLocalities(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLocalityType>>;
}
/**
 * Contains all the endpoints needed to manage localities.
 */

export class LocalityApiClient {
  /**
   * This endpoint retrieves the list of available localities.
   * @param params
   * @param config
   */
  static getLocalities(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLocalityType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetLocalities.url({})}?${p.toString()}`, method: Endpoints.GetLocalities.method});
  }

  /**
   * This endpoint searches localities
   * @param params
   * @param config
   */
  static searchLocalities(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLocalityType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.ComposerLocalitySearch.url({})}?${p.toString()}`,
      method: Endpoints.ComposerLocalitySearch.method
    });
  }
}

/**
 *
 :::tipLocality service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {LocalityService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getLocalities` will return the paginated list of localities.

 async getLocalities() {
        return await LocalityService.getLocalities();
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
export default class LocalityService {
  static async getLocalities(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLocalityType>> {
    return LocalityApiClient.getLocalities(params, config);
  }
  static async searchLocalities(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLocalityType>> {
    return LocalityApiClient.searchLocalities(params, config);
  }
}
