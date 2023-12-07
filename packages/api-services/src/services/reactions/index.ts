import {ReactionParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCReactionType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface ReactionApiClientInterface {
  getAllReactions(params?: ReactionParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCReactionType>>;
  getSpecificReaction(id: number, config?: AxiosRequestConfig): Promise<SCReactionType>;
}
/**
 * Contains all the endpoints needed to manage features.
 */

export class ReactionApiClient {
  /**
   * This endpoint retrieves all reactions.
   * @param params
   * @param config
   */
  static getAllReactions(params?: ReactionParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCReactionType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetReactions.url({})}?${p.toString()}`, method: Endpoints.GetReactions.method});
  }

  /**
   * This endpoint retrieves all reactions data without pagination.
   * @param params
   * @param config
   */
  static async getAllReactionsList(params?: ReactionParams, config?: AxiosRequestConfig): Promise<SCReactionType[]> {
    const p = urlParams(params);
    const response = await apiRequest({
      ...config,
      url: `${Endpoints.GetReactions.url({})}?${p.toString()}`,
      method: Endpoints.GetReactions.method
    });
    if (response.next) {
      return response.results.concat(
        await ReactionApiClient.getAllReactionsList(params, {
          ...config,
          url: response.next,
          method: Endpoints.GetReactions.method
        })
      );
    }
    return response.results;
  }

  /**
   * This endpoint retrieves a specific reaction.
   * @param id
   * @param config
   */
  static getSpecificReaction(id: number, config?: AxiosRequestConfig): Promise<SCReactionType> {
    return apiRequest({url: Endpoints.GetSpecificReaction.url({id}), method: Endpoints.GetSpecificReaction.method, ...config});
  }
}

/**
 *
 :::tipFeature service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {ReactionService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllReactions` will return the list of reactions.

 async getAllReactions() {
        return await ReactionService.getAllReactions();
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
export default class ReactionService {
  static async getAllReactions(params?: ReactionParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCReactionType>> {
    return ReactionApiClient.getAllReactions(params, config);
  }
  static async getAllReactionsList(params?: ReactionParams, config?: AxiosRequestConfig): Promise<SCReactionType[]> {
    return ReactionApiClient.getAllReactionsList(params, config);
  }
  static async getSpecificReaction(id: number, config?: AxiosRequestConfig): Promise<SCReactionType> {
    return ReactionApiClient.getSpecificReaction(id, config);
  }
}
