import {SCPaginatedResponse} from '../../types';
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
  getBestContributionInsight(): Promise<SCPaginatedResponse<SCContributionInsightType>>;
  getBestEmbedInsight(): Promise<SCPaginatedResponse<SCEmbedInsightType>>;
  getBestUsersInsight(): Promise<SCPaginatedResponse<SCUsersInsightType>>;
  getContributionsInsightCounters(id: number): Promise<SCContributionInsightCountersType>;
  getEmbedsInsightCounters(id: number): Promise<SCEmbedInsightCountersType>;
  getUsersInsightCounters(id: number): Promise<SCUsersInsightCountersType>;
}

export class InsightApiClient {
  /**
   * This endpoint retrieves the best contribution insights list.
   */
  static getBestContributionInsight(): Promise<SCPaginatedResponse<SCContributionInsightType>> {
    return apiRequest(Endpoints.InsightBestContribution.url({}), Endpoints.InsightBestContribution.method);
  }

  /**
   * This endpoint retrieves the best embed insights list. The operations of this endpoint is quite complex and returns different result structures based on the parameters passed. For example, pagination (and therefore the use of the offset parameter) is guaranteed only if the metadata and group_by parameter are not passed. If you are passing metadata you MUST pass also group_by. If you pass group_by the result will be not paginated and will contain only user defined custom embeds (not among these: 'sc_vimeo', 'sc_link', 'sc_shared_object').
   */
  static getBestEmbedInsight(): Promise<SCPaginatedResponse<SCEmbedInsightType>> {
    return apiRequest(Endpoints.InsightBestEmbed.url({}), Endpoints.InsightBestEmbed.method);
  }

  /**
   * This endpoint retrieves the best users insights list.
   */
  static getBestUsersInsight(): Promise<SCPaginatedResponse<SCUsersInsightType>> {
    return apiRequest(Endpoints.InsightBestUser.url({}), Endpoints.InsightBestUser.method);
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
   * @param id
   */
  static getEmbedsInsightCounters(id: number): Promise<SCEmbedInsightCountersType> {
    return apiRequest(Endpoints.InsightEmbedCounter.url({id}), Endpoints.InsightEmbedCounter.method);
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
  static async getBestContributionInsight(): Promise<SCPaginatedResponse<SCContributionInsightType>> {
    return InsightApiClient.getBestContributionInsight();
  }

  static async getBestEmbedInsight(): Promise<SCPaginatedResponse<SCEmbedInsightType>> {
    return InsightApiClient.getBestEmbedInsight();
  }

  static async getBestUsersInsight(): Promise<SCPaginatedResponse<SCUsersInsightType>> {
    return InsightApiClient.getBestUsersInsight();
  }

  static async getContributionsInsightCounters(id: number): Promise<SCContributionInsightCountersType> {
    return InsightApiClient.getContributionsInsightCounters(id);
  }

  static async getEmbedsInsightCounters(id: number): Promise<SCEmbedInsightCountersType> {
    return InsightApiClient.getEmbedsInsightCounters(id);
  }

  static async getUsersInsightCounters(id: number): Promise<SCUsersInsightCountersType> {
    return InsightApiClient.getUsersInsightCounters(id);
  }
}
