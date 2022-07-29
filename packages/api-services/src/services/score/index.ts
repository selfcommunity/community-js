import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserScoreType} from '@selfcommunity/types/src/types';
import {ScoreParams, SCPaginatedResponse, UserScoreParams} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface ScoreApiClientInterface {
  getAllScores(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>>;
  searchScore(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>>;
  addScore(data: UserScoreParams, config?: AxiosRequestConfig): Promise<SCUserScoreType>;
}
/**
 * Contains all the endpoints needed to manage user scores.
 */

export class ScoreApiClient {
  /**
   * This endpoint retrieves all users scores.
   * @param params
   * @param config
   */
  static getAllScores(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.ScoresList.url({})}?${p.toString()}`, method: Endpoints.ScoresList.method});
  }

  /**
   * This endpoint performs search to user scores.
   * @param params
   * @param config
   */
  static searchScore(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchScore.url({})}?${p.toString()}`, method: Endpoints.SearchScore.method});
  }

  /**
   * This endpoint adds/removes score to a user.
   * @param data
   * @param config
   */
  static addScore(data: UserScoreParams, config?: AxiosRequestConfig): Promise<SCUserScoreType> {
    return apiRequest({...config, url: Endpoints.AddScore.url({}), method: Endpoints.AddScore.method, data: data});
  }
}

/**
 *
 :::tipScore service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {ScoreService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllScores` will return the paginated list of user scores.

 async getAllScores() {
       return await ScoreService.getAllScores();
     }
 ```
 :::
 */
export default class ScoreService {
  static async getAllScores(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return ScoreApiClient.getAllScores(params, config);
  }
  static async searchScore(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return ScoreApiClient.searchScore(params, config);
  }
  static async addScore(data: UserScoreParams, config?: AxiosRequestConfig): Promise<SCUserScoreType> {
    return ScoreApiClient.addScore(data, config);
  }
}
