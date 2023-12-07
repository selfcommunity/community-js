import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {BaseGetParams, SCPaginatedResponse} from '../../types';
import {SCCategoryType, SCFeedObjectType, SCIncubatorType, SCSuggestionType, SCUserType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface SuggestionApiClientInterface {
  getCategorySuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>>;
  getIncubatorSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>>;
  getPollSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  getUserSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getSearchSuggestion(search: string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCSuggestionType>>;
}
/**
 * Contains all the endpoints needed to manage suggestions.
 */

export class SuggestionApiClient {
  /**
   * This endpoint retrieves a list of categories suggested to the current user.
   * @param params
   * @param config
   */
  static getCategorySuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest({...config, url: Endpoints.CategoriesSuggestion.url({}), method: Endpoints.CategoriesSuggestion.method, params});
  }

  /**
   * This endpoint retrieves a list of suggested incubators.
   * @param params
   * @param config
   */
  static getIncubatorSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>> {
    return apiRequest({...config, url: Endpoints.GetIncubatorSuggestion.url({}), method: Endpoints.GetIncubatorSuggestion.method, params});
  }

  /**
   * This endpoint retrieves a list of contributes(discussions, posts, statuses) with a related poll.
   * @param params
   * @param config
   */
  static getPollSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return apiRequest({...config, url: Endpoints.PollSuggestion.url({}), method: Endpoints.PollSuggestion.method, params});
  }

  /**
   * This endpoint retrieves a list of users suggested to the current user.
   * @param params
   * @param config
   */
  static getUserSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.UserSuggestion.url({}), method: Endpoints.UserSuggestion.method, params});
  }
  /**
   * This endpoint retrieves a list of users suggested to the current user.
   * @param search
   * @param params
   * @param config
   */
  static getSearchSuggestion(search: string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCSuggestionType>> {
    const p = urlParams({search: search});
    return apiRequest({...config, url: `${Endpoints.SearchSuggestion.url({})}?${p.toString()}`, method: Endpoints.UserSuggestion.method, params});
  }
}

/**
 *
 :::tipSuggestion service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {SuggestionService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getCategorySuggestion` will return the paginated list of categories.

 async getCategorySuggestion() {
          return await SuggestionService.getCategorySuggestion();
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
export default class SuggestionService {
  static async getCategorySuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return SuggestionApiClient.getCategorySuggestion(params, config);
  }

  static async getIncubatorSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCIncubatorType>> {
    return SuggestionApiClient.getIncubatorSuggestion(params, config);
  }

  static async getPollSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return SuggestionApiClient.getPollSuggestion(params, config);
  }

  static async getUserSuggestion(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return SuggestionApiClient.getUserSuggestion(params, config);
  }
  static async getSearchSuggestion(
    search: string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCSuggestionType>> {
    return SuggestionApiClient.getSearchSuggestion(search, params, config);
  }
}
