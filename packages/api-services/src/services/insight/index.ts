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
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface InsightApiClientInterface {
  getBestContributionInsight(
    params?: InsightContributionParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCContributionInsightType>>;
  getBestEmbedInsight(params?: InsightEmbedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedInsightType>>;
  getBestUsersInsight(params?: InsightUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUsersInsightType>>;
  getContributionsInsightCounters(id: number, config?: AxiosRequestConfig): Promise<SCContributionInsightCountersType>;
  getEmbedsInsightCounters(type: string, id: number, config?: AxiosRequestConfig): Promise<SCEmbedInsightCountersType>;
  getUsersInsightCounters(id: number, config?: AxiosRequestConfig): Promise<SCUsersInsightCountersType>;
}
/**
 * Contains all the endpoints needed to manage insights.
 */

export class InsightApiClient {
  /**
   * This endpoint retrieves the best contribution insights list.
   * @param params
   * @param config
   */
  static getBestContributionInsight(
    params?: InsightContributionParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCContributionInsightType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.InsightBestContribution.url({})}?${p.toString()}`,
      method: Endpoints.InsightBestContribution.method
    });
  }

  /**
   * This endpoint retrieves the best embed insights list. The operations of this endpoint is quite complex and returns different result structures based on the parameters passed. For example, pagination (and therefore the use of the offset parameter) is guaranteed only if the metadata and group_by parameter are not passed. If you are passing metadata you MUST pass also group_by. If you pass group_by the result will be not paginated and will contain only user defined custom embeds (not among these: 'sc_vimeo', 'sc_link', 'sc_shared_object').
   * @param params
   * @param config
   */
  static getBestEmbedInsight(params?: InsightEmbedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedInsightType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.InsightBestEmbed.url({})}?${p.toString()}`, method: Endpoints.InsightBestEmbed.method});
  }

  /**
   * This endpoint retrieves the best users insights list.
   * @param params
   * @param config
   */
  static getBestUsersInsight(params?: InsightUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUsersInsightType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.InsightBestUser.url({})}?${p.toString()}`, method: Endpoints.InsightBestUser.method});
  }

  /**
   * This endpoint retrieves a specific contribution's insight counters.
   * @param id
   * @param config
   */
  static getContributionsInsightCounters(id: number, config?: AxiosRequestConfig): Promise<SCContributionInsightCountersType> {
    return apiRequest({...config, url: Endpoints.InsightContributionCounter.url({id}), method: Endpoints.InsightContributionCounter.method});
  }

  /**
   * This endpoint retrieves a specific embed's insight counters.
   * @param type
   * @param id
   * @param config
   */
  static getEmbedsInsightCounters(type: string, id: number, config?: AxiosRequestConfig): Promise<SCEmbedInsightCountersType> {
    return apiRequest({...config, url: Endpoints.InsightEmbedCounter.url({type, id}), method: Endpoints.InsightEmbedCounter.method});
  }

  /**
   * This endpoint retrieves a specific user's insight counters.
   * @param id
   * @param config
   */
  static getUsersInsightCounters(id: number, config?: AxiosRequestConfig): Promise<SCUsersInsightCountersType> {
    return apiRequest({...config, url: Endpoints.InsightUserCounter.url({id}), method: Endpoints.InsightUserCounter.method});
  }
}

/**
 *
 :::tipInsight service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {InsightService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getBestContributionInsight` will return the paginated list of contribution insights.

 async getBestContributionInsight() {
        return await InsightService.getBestContributionInsight();
     }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getEmbedsInsightCounters(embedType, embedId) {
        return await InsightService.getEmbedsInsightCounters(embedType, embedId);
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
export default class InsightService {
  static async getBestContributionInsight(
    params?: InsightContributionParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCContributionInsightType>> {
    return InsightApiClient.getBestContributionInsight(params, config);
  }

  static async getBestEmbedInsight(params?: InsightEmbedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCEmbedInsightType>> {
    return InsightApiClient.getBestEmbedInsight(params, config);
  }

  static async getBestUsersInsight(params?: InsightUserParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUsersInsightType>> {
    return InsightApiClient.getBestUsersInsight(params, config);
  }

  static async getContributionsInsightCounters(id: number, config?: AxiosRequestConfig): Promise<SCContributionInsightCountersType> {
    return InsightApiClient.getContributionsInsightCounters(id, config);
  }

  static async getEmbedsInsightCounters(type: string, id: number, config?: AxiosRequestConfig): Promise<SCEmbedInsightCountersType> {
    return InsightApiClient.getEmbedsInsightCounters(type, id, config);
  }

  static async getUsersInsightCounters(id: number, config?: AxiosRequestConfig): Promise<SCUsersInsightCountersType> {
    return InsightApiClient.getUsersInsightCounters(id, config);
  }
}
