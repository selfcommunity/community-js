import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeedUnitType, SCFeedUnseenCountType} from '@selfcommunity/types';
import {FeedParams, SCPaginatedResponse} from '../../types';

export interface FeedApiClientInterface {
  getMainFeed(token: string, params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getExploreFeed(params?: FeedParams, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getMainFeedUnseenCount(token: string): Promise<SCFeedUnseenCountType>;
  markReadASpecificFeedObj(token: string, object: number[]): Promise<any>;
  likeFeedObjs(token: string, object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}
/**
 * Contains all the endpoints needed to manage feed.
 */

export class FeedApiClient {
  /**
   * This endpoint retrieves the main (home) feed.
   * @param token
   * @param params
   */
  static getMainFeed(token: string, params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.MainFeed.url({})}?${p.toString()}`, Endpoints.MainFeed.method, token);
  }

  /**
   * This endpoint retrieves the explore feed. This endpoint can be disabled by setting explore_stream_enabled community option to false.
   * @param params
   * @param token
   */
  static getExploreFeed(params?: FeedParams, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.ExploreFeed.url({})}?${p.toString()}`, Endpoints.ExploreFeed.method, token);
  }

  /**
   * This endpoint retrieves Main Feed unseen count.
   * @param token
   */
  static getMainFeedUnseenCount(token: string): Promise<SCFeedUnseenCountType> {
    return apiRequest(Endpoints.MainFeedUnseenCount.url({}), Endpoints.MainFeedUnseenCount.method, token);
  }

  /**
   * This endpoint marks as read a list of objects in the feed. Usually it is called when a Feed object enter the viewport of the user.
   * @param token
   * @param object
   */
  static markReadASpecificFeedObj(token: string, object: number[]): Promise<any> {
    return apiRequest(Endpoints.FeedObjectMarkRead.url({}), Endpoints.FeedObjectMarkRead.method, token, {object: object});
  }

  /**
   * This endpoint retrieves a list of Feed objects similar to the id of passed objects
   * @param token
   * @param object
   */
  static likeFeedObjs(token: string, object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.FeedLikeThese.url({}), Endpoints.FeedLikeThese.method, token, {object: object});
  }
}

export default class FeedService {
  static async getMainFeed(token: string, params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getMainFeed(token, params);
  }
  static async getExploreFeed(params?: FeedParams, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getExploreFeed(params, token);
  }

  static async getMainFeedUnseenCount(token: string): Promise<SCFeedUnseenCountType> {
    return FeedApiClient.getMainFeedUnseenCount(token);
  }
  static async markReadASpecificFeedObj(token: string, object: number[]): Promise<any> {
    return FeedApiClient.markReadASpecificFeedObj(token, object);
  }
  static async likeFeedObjs(token: string, object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.likeFeedObjs(token, object);
  }
}
