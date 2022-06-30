import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCPaginatedResponse} from '../../types';
import {SCCategoryType, SCFeedObjectType, SCIncubatorType, SCUserType} from '@selfcommunity/types';

export interface SuggestionApiClientInterface {
  getCategorySuggestion(): Promise<SCPaginatedResponse<SCCategoryType>>;
  getIncubatorSuggestion(): Promise<SCIncubatorType[]>;
  getPollSuggestion(): Promise<SCFeedObjectType[]>;
  getUserSuggestion(): Promise<SCPaginatedResponse<SCUserType>>;
}
/**
 * Contains all the endpoints needed to manage suggestions.
 */

export class SuggestionApiClient {
  /**
   * This endpoint retrieves a list of categories suggested to the current user.
   */
  static getCategorySuggestion(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest(Endpoints.CategoriesSuggestion.url({}), Endpoints.CategoriesSuggestion.method);
  }

  /**
   * This endpoint retrieves a list of suggested incubators.
   */
  static getIncubatorSuggestion(): Promise<SCIncubatorType[]> {
    return apiRequest(Endpoints.GetIncubatorSuggestion.url({}), Endpoints.GetIncubatorSuggestion.method);
  }

  /**
   * This endpoint retrieves a list of contributes(discussions, posts, statuses) with a related poll.
   */
  static getPollSuggestion(): Promise<SCFeedObjectType[]> {
    return apiRequest(Endpoints.PollSuggestion.url({}), Endpoints.PollSuggestion.method);
  }

  /**
   * This endpoint retrieves a list of users suggested to the current user.
   */
  static getUserSuggestion(): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.UserSuggestion.url({}), Endpoints.UserSuggestion.method);
  }
}

export default class SuggestionService {
  static async getCategorySuggestion(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return SuggestionApiClient.getCategorySuggestion();
  }

  static async getIncubatorSuggestion(): Promise<SCIncubatorType[]> {
    return SuggestionApiClient.getIncubatorSuggestion();
  }

  static async getPollSuggestion(): Promise<SCFeedObjectType[]> {
    return SuggestionApiClient.getPollSuggestion();
  }

  static async getUserSuggestion(): Promise<SCPaginatedResponse<SCUserType>> {
    return SuggestionApiClient.getUserSuggestion();
  }
}
