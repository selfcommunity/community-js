import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCPaginatedResponse} from '../../types';
import {SCCategoryType, SCFeedObjectType, SCIncubatorType, SCSuggestionType, SCUserType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface SuggestionApiClientInterface {
  getCategorySuggestion(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>>;
  getIncubatorSuggestion(config?: AxiosRequestConfig): Promise<SCIncubatorType[]>;
  getPollSuggestion(config?: AxiosRequestConfig): Promise<SCFeedObjectType[]>;
  getUserSuggestion(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getSearchSuggestion(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCSuggestionType>>;
}
/**
 * Contains all the endpoints needed to manage suggestions.
 */

export class SuggestionApiClient {
  /**
   * This endpoint retrieves a list of categories suggested to the current user.
   * @param config
   */
  static getCategorySuggestion(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest({...config, url: Endpoints.CategoriesSuggestion.url({}), method: Endpoints.CategoriesSuggestion.method});
  }

  /**
   * This endpoint retrieves a list of suggested incubators.
   * @param config
   */
  static getIncubatorSuggestion(config?: AxiosRequestConfig): Promise<SCIncubatorType[]> {
    return apiRequest({...config, url: Endpoints.GetIncubatorSuggestion.url({}), method: Endpoints.GetIncubatorSuggestion.method});
  }

  /**
   * This endpoint retrieves a list of contributes(discussions, posts, statuses) with a related poll.
   * @param config
   */
  static getPollSuggestion(config?: AxiosRequestConfig): Promise<SCFeedObjectType[]> {
    return apiRequest({...config, url: Endpoints.PollSuggestion.url({}), method: Endpoints.PollSuggestion.method});
  }

  /**
   * This endpoint retrieves a list of users suggested to the current user.
   * @param config
   */
  static getUserSuggestion(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.UserSuggestion.url({}), method: Endpoints.UserSuggestion.method});
  }
  /**
   * This endpoint retrieves a list of users suggested to the current user.
   * @param search
   * @param config
   */
  static getSearchSuggestion(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCSuggestionType>> {
    const p = urlParams({search: search});
    return apiRequest({...config, url: `${Endpoints.SearchSuggestion.url({})}?${p.toString()}`, method: Endpoints.UserSuggestion.method});
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
  static async getCategorySuggestion(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return SuggestionApiClient.getCategorySuggestion(config);
  }

  static async getIncubatorSuggestion(config?: AxiosRequestConfig): Promise<SCIncubatorType[]> {
    return SuggestionApiClient.getIncubatorSuggestion(config);
  }

  static async getPollSuggestion(config?: AxiosRequestConfig): Promise<SCFeedObjectType[]> {
    return SuggestionApiClient.getPollSuggestion(config);
  }

  static async getUserSuggestion(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return SuggestionApiClient.getUserSuggestion(config);
  }
  static async getSearchSuggestion(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCSuggestionType>> {
    return SuggestionApiClient.getSearchSuggestion(search, config);
  }
}
