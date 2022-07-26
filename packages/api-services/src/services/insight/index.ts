import {InsightContributionParams, InsightEmbedParams, InsightUserParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {
  SCContributionInsightCountersType,
  SCContributionInsightType,
  SCEmbedInsightCountersType,
  SCEmbedInsightType,
  SCUsersInsightCountersType,
  SCUsersInsightType
} from '@selfcommunity/types';

export interface InsightApiClientInterface {
  getBestContributionInsight(params?: InsightContributionParams): Promise<SCPaginatedResponse<SCContributionInsightType>>;
  getBestEmbedInsight(params?: InsightEmbedParams): Promise<SCPaginatedResponse<SCEmbedInsightType>>;
  getBestUsersInsight(params?: InsightUserParams): Promise<SCPaginatedResponse<SCUsersInsightType>>;
  getContributionsInsightCounters(id: number): Promise<SCContributionInsightCountersType>;
  getEmbedsInsightCounters(type: string, id: number): Promise<SCEmbedInsightCountersType>;
  getUsersInsightCounters(id: number): Promise<SCUsersInsightCountersType>;
}
/**
 * Contains all the endpoints needed to manage insights.
 */

export class InsightApiClient {
  /**
   * This endpoint retrieves the best contribution insights list.
   * @param params
   */
  static getBestContributionInsight(params?: InsightContributionParams): Promise<SCPaginatedResponse<SCContributionInsightType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.InsightBestContribution.url({})}?${p.toString()}`, Endpoints.InsightBestContribution.method);
  }

  /**
   * This endpoint retrieves the best embed insights list. The operations of this endpoint is quite complex and returns different result structures based on the parameters passed. For example, pagination (and therefore the use of the offset parameter) is guaranteed only if the metadata and group_by parameter are not passed. If you are passing metadata you MUST pass also group_by. If you pass group_by the result will be not paginated and will contain only user defined custom embeds (not among these: 'sc_vimeo', 'sc_link', 'sc_shared_object').
   * @param params
   */
  static getBestEmbedInsight(params?: InsightEmbedParams): Promise<SCPaginatedResponse<SCEmbedInsightType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.InsightBestEmbed.url({})}?${p.toString()}`, Endpoints.InsightBestEmbed.method);
  }

  /**
   * This endpoint retrieves the best users insights list.
   * @param params
   */
  static getBestUsersInsight(params?: InsightUserParams): Promise<SCPaginatedResponse<SCUsersInsightType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.InsightBestUser.url({})}?${p.toString()}`, Endpoints.InsightBestUser.method);
  }

  /**
   * This endpoint retrieves a specific contribution's insight counters.
   * @param id
   */
  static getContributionsInsightCounters(id: number): Promise<SCContributionInsightCountersType> {
    return apiRequest(Endpoints.InsightContributionCounter.url({id}), Endpoints.InsightContributionCounter.method);
  }

  /**
   * This endpoint retrieves a specific embed's insight counters.
   * @param type
   * @param id
   */
  static getEmbedsInsightCounters(type: string, id: number): Promise<SCEmbedInsightCountersType> {
    return apiRequest(Endpoints.InsightEmbedCounter.url({type, id}), Endpoints.InsightEmbedCounter.method);
  }

  /**
   * This endpoint retrieves a specific user's insight counters.
   * @param id
   */
  static getUsersInsightCounters(id: number): Promise<SCUsersInsightCountersType> {
    return apiRequest(Endpoints.InsightUserCounter.url({id}), Endpoints.InsightUserCounter.method);
  }
}

export default class InsightService {
  /**
   *  :::tipInsight service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {InsightService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getBestContributionInsight` will return the paginated list of contribution insights.
   *
   *     async getBestContributionInsight() {
   *       return await InsightService.getBestContributionInsight();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async getEmbedsInsightCounters(embedType, embedId) {
   *       return await InsightService.getEmbedsInsightCounters(embedType, embedId);
   *     }
   *  ```
   *  :::
   */
  static async getBestContributionInsight(params?: InsightContributionParams): Promise<SCPaginatedResponse<SCContributionInsightType>> {
    return InsightApiClient.getBestContributionInsight(params);
  }

  static async getBestEmbedInsight(params?: InsightEmbedParams): Promise<SCPaginatedResponse<SCEmbedInsightType>> {
    return InsightApiClient.getBestEmbedInsight(params);
  }

  static async getBestUsersInsight(params?: InsightUserParams): Promise<SCPaginatedResponse<SCUsersInsightType>> {
    return InsightApiClient.getBestUsersInsight(params);
  }

  static async getContributionsInsightCounters(id: number): Promise<SCContributionInsightCountersType> {
    return InsightApiClient.getContributionsInsightCounters(id);
  }

  static async getEmbedsInsightCounters(type: string, id: number): Promise<SCEmbedInsightCountersType> {
    return InsightApiClient.getEmbedsInsightCounters(type, id);
  }

  static async getUsersInsightCounters(id: number): Promise<SCUsersInsightCountersType> {
    return InsightApiClient.getUsersInsightCounters(id);
  }
}
