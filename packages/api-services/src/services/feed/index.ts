import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeedUnitType, SCFeedUnseenCountType} from '@selfcommunity/types';
import {FeedParams, SCPaginatedResponse} from '../../types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface FeedApiClientInterface {
  getMainFeed(params?: FeedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getExploreFeed(params?: FeedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getMainFeedUnseenCount(config?: AxiosRequestConfig): Promise<SCFeedUnseenCountType>;
  markReadASpecificFeedObj(object: number[], config?: AxiosRequestConfig): Promise<any>;
  likeFeedObjs(object: number[], config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}
/**
 * Contains all the endpoints needed to manage feed.
 */

export class FeedApiClient {
  /**
   * This endpoint retrieves the main (home) feed.
   * @param params
   * @param config
   */
  static getMainFeed(params?: FeedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.MainFeed.url({})}?${p.toString()}`, method: Endpoints.MainFeed.method});
  }

  /**
   * This endpoint retrieves  explore feed. This endpoint can be disabled by setting explore_stream_enabled community option to false.
   * @param params
   * @param config
   */
  static getExploreFeed(params?: FeedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.ExploreFeed.url({})}?${p.toString()}`, method: Endpoints.ExploreFeed.method});
  }

  /**
   * This endpoint retrieves Main Feed unseen count.
   * @param config
   */
  static getMainFeedUnseenCount(config?: AxiosRequestConfig): Promise<SCFeedUnseenCountType> {
    return apiRequest({...config, url: Endpoints.MainFeedUnseenCount.url({}), method: Endpoints.MainFeedUnseenCount.method});
  }

  /**
   * This endpoint marks as read a list of objects in the feed. Usually it is called when a Feed object enter the viewport of the user.
   * @param object
   * @param config
   */
  static markReadASpecificFeedObj(object: number[], config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.FeedObjectMarkRead.url({}), method: Endpoints.FeedObjectMarkRead.method, data: {object: object}});
  }

  /**
   * This endpoint retrieves a list of Feed objects similar to the id of passed objects
   * @param object
   * @param config
   */
  static likeFeedObjs(object: number[], config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest({...config, url: Endpoints.FeedLikeThese.url({}), method: Endpoints.FeedLikeThese.method, data: {object: object}});
  }
}

/**
 *
 :::tip Feed service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {FeedService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getMainFeed` will return the paginated list of main feed posts.

 async getMainFeed() {
       return await FeedService.getMainFeed();
     }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async likeFeedObjs(objIds) {
       return await FeedService.likeFeedObjs(objIds);
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
export default class FeedService {
  static async getMainFeed(params?: FeedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getMainFeed(params, config);
  }
  static async getExploreFeed(params?: FeedParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.getExploreFeed(params, config);
  }

  static async getMainFeedUnseenCount(config?: AxiosRequestConfig): Promise<SCFeedUnseenCountType> {
    return FeedApiClient.getMainFeedUnseenCount(config);
  }
  static async markReadASpecificFeedObj(object: number[], config?: AxiosRequestConfig): Promise<any> {
    return FeedApiClient.markReadASpecificFeedObj(object, config);
  }
  static async likeFeedObjs(object: number[], config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return FeedApiClient.likeFeedObjs(object, config);
  }
}
