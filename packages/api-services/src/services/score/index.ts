import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserScoreType} from '@selfcommunity/types';
import {ScoreParams, SCPaginatedResponse, UserScoreParams} from '../../types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

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
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.ScoresList.url({})}?${p.toString()}`, method: Endpoints.ScoresList.method});
  }

  /**
   * This endpoint performs search to user scores.
   * @param params
   * @param config
   */
  static searchScore(params?: ScoreParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserScoreType>> {
    const p = urlParams(params);
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
 :::tip Score service can be used in the following way:

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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
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
