import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeedUnitType, SCFeedUnseenCountType} from '@selfcommunity/types';
import {FeedParams, SCPaginatedResponse} from '../../types';

export interface FeedApiClientInterface {
  getMainFeed(params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getExploreFeed(params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>>;
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
   * @param params
   */
  static getMainFeed(params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.MainFeed.url({})}?${p.toString()}`, Endpoints.MainFeed.method);
  }

  /**
   * This endpoint retrieves the explore feed. This endpoint can be disabled by setting explore_stream_enabled community option to false.
   * @param params
   */
  static getExploreFeed(params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.ExploreFeed.url({})}?${p.toString()}`, Endpoints.ExploreFeed.method);
  }

  /**
   * This endpoint retrieves Main Feed unseen count.
   */
  static getMainFeedUnseenCount(): Promise<SCFeedUnseenCountType> {
    return apiRequest(Endpoints.MainFeedUnseenCount.url({}), Endpoints.MainFeedUnseenCount.method);
  }

  /**
   * This endpoint marks as read a list of objects in the feed. Usually it is called when a Feed object enter the viewport of the user.
   * @param object
   */
  static markReadASpecificFeedObj(object: number[]): Promise<any> {
    return apiRequest(Endpoints.FeedObjectMarkRead.url({}), Endpoints.FeedObjectMarkRead.method, {object: object});
  }

  /**
   * This endpoint retrieves a list of Feed objects similar to the id of passed objects
   * @param object
   */
  static likeFeedObjs(object: number[]): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.FeedLikeThese.url({}), Endpoints.FeedLikeThese.method, {object: object});
  }
}

export default class FeedService {
  /**
   *  :::tipFeed service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {FeedService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getMainFeed` will return the paginated list of main feed posts.
   *
   *     async getMainFeed() {
   *       return await FeedService.getMainFeed();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async likeFeedObjs(objIds) {
   *       return await FeedService.likeFeedObjs(objIds);
   *     }
   *  ```
   *  :::
   */
  static async getMainFeed(params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getMainFeed(params);
  }
  static async getExploreFeed(params?: FeedParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getExploreFeed(params);
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
