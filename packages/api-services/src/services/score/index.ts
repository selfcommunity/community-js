import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserScoreType} from '@selfcommunity/types/src/types';
import {ScoreParams, SCPaginatedResponse, UserScoreParams} from '../../types';

export interface ScoreApiClientInterface {
  getAllScores(params?: ScoreParams): Promise<SCPaginatedResponse<SCUserScoreType>>;
  searchScore(params?: ScoreParams): Promise<SCPaginatedResponse<SCUserScoreType>>;
  addScore(data: UserScoreParams): Promise<SCUserScoreType>;
}
/**
 * Contains all the endpoints needed to manage user scores.
 */

export class ScoreApiClient {
  /**
   * This endpoint retrieves all users scores.
   * @param params
   */
  static getAllScores(params?: ScoreParams): Promise<SCPaginatedResponse<SCUserScoreType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.ScoresList.url({})}?${p.toString()}`, Endpoints.ScoresList.method);
  }

  /**
   * This endpoint performs search to user scores.
   * @param params
   */
  static searchScore(params?: ScoreParams): Promise<SCPaginatedResponse<SCUserScoreType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.SearchScore.url({})}?${p.toString()}`, Endpoints.SearchScore.method);
  }

  /**
   * This endpoint adds/removes score to a user.
   * @param data
   */
  static addScore(data: UserScoreParams): Promise<SCUserScoreType> {
    return apiRequest(Endpoints.AddScore.url({}), Endpoints.AddScore.method, data);
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
  static async getAllScores(params?: ScoreParams): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return ScoreApiClient.getAllScores(params);
  }
  static async searchScore(params?: ScoreParams): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return ScoreApiClient.searchScore(params);
  }
  static async addScore(data: UserScoreParams): Promise<SCUserScoreType> {
    return ScoreApiClient.addScore(data);
  }
}
