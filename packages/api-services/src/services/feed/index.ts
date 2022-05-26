import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeedUnitType, SCFeedUnseenCountType} from '@selfcommunity/types';
import {SCPaginatedResponse} from '../../types';

export interface FeedApiClientInterface {
  getMainFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getExploreFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getMainFeedUnseenCount(): Promise<SCFeedUnseenCountType>;
  markReadASpecificFeedObj(object: number[]): Promise<any>;
  likeFeedObjs(object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}
/**
 * Contains all the endpoints needed to manage feed.
 */

export class FeedApiClient {
  /**
   * This endpoint retrieves the main (home) feed.
   */
  static getMainFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.MainFeed.url({}), Endpoints.MainFeed.method);
  }

  /**
   * This endpoint retrieves the explore feed. This endpoint can be disabled by setting explore_stream_enabled community option to false.
   */
  static getExploreFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.ExploreFeed.url({}), Endpoints.ExploreFeed.method);
  }

  /**
   * This endpoint retrieves Main Feed unseen count.
   */
  static getMainFeedUnseenCount(): Promise<SCFeedUnseenCountType> {
    return apiRequest(Endpoints.MainFeedUnseenCount.url({}), Endpoints.MainFeedUnseenCount.method);
  }

  /**
   * This endpoint marks as read a list of objects in the feed. Usually it is called when a Feed object enter the viewport of the user.
   */
  static markReadASpecificFeedObj(object: number[]): Promise<any> {
    return apiRequest(Endpoints.FeedObjectMarkRead.url({}), Endpoints.FeedObjectMarkRead.method, {object: object});
  }

  /**
   * This endpoint retrieves a list of Feed objects similar to the id of passed objects
   */
  static likeFeedObjs(object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.FeedLikeThese.url({}), Endpoints.FeedLikeThese.method, {object: object});
  }
}

export default class FeedService {
  static async getMainFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getMainFeed();
  }
  static async getExploreFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getExploreFeed();
  }

  static async getMainFeedUnseenCount(): Promise<SCFeedUnseenCountType> {
    return FeedApiClient.getMainFeedUnseenCount();
  }
  static async markReadASpecificFeedObj(object: number[]): Promise<any> {
    return FeedApiClient.markReadASpecificFeedObj(object);
  }
  static async likeFeedObjs(object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.likeFeedObjs(object);
  }
}
