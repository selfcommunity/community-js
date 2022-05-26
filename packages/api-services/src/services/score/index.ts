import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserScoreType} from '@selfcommunity/types/src/types';
import {SCPaginatedResponse, UserScoreParams} from '../../types';

export interface ScoreApiClientInterface {
  getAllScores(): Promise<SCPaginatedResponse<SCUserScoreType>>;
  searchScore(): Promise<SCPaginatedResponse<SCUserScoreType>>;
  addScore(data: UserScoreParams): Promise<SCUserScoreType>;
}
/**
 * Contains all the endpoints needed to manage user scores.
 */

export class ScoreApiClient {
  /**
   * This endpoint retrieves all users scores.
   */
  static getAllScores(): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return apiRequest(Endpoints.ScoresList.url({}), Endpoints.ScoresList.method);
  }

  /**
   * This endpoint performs search to user scores.
   */
  static searchScore(): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return apiRequest(Endpoints.SearchScore.url({}), Endpoints.SearchScore.method);
  }

  /**
   * This endpoint adds/removes score to a user.
   * @param data
   */
  static addScore(data: UserScoreParams): Promise<SCUserScoreType> {
    return apiRequest(Endpoints.AddScore.url({}), Endpoints.AddScore.method, data);
  }
}

export default class ScoreService {
  static async getAllScores(): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return ScoreApiClient.getAllScores();
  }
  static async searchScore(): Promise<SCPaginatedResponse<SCUserScoreType>> {
    return ScoreApiClient.searchScore();
  }
  static async addScore(data: UserScoreParams): Promise<SCUserScoreType> {
    return ScoreApiClient.addScore(data);
  }
}
