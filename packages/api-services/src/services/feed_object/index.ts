import {apiRequest} from '../../utils/apiRequest';
import {BaseGetParams, BaseSearchParams, FeedObjCreateParams, FeedObjectPollVotesSearch, FeedObjGetParams, SCPaginatedResponse} from '../../types';
import Endpoints from '../../constants/Endpoints';
import {
  SCContributionType,
  SCFeedObjectFollowingStatusType,
  SCFeedObjectHideStatusType,
  SCFeedObjectSuspendedStatusType,
  SCFeedObjectType,
  SCFlagType,
  SCFlagTypeEnum,
  SCPollVoteType,
  SCUserType,
  SCVoteType
} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface FeedObjectApiClientInterface {
  getAllFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: FeedObjGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  getUncommentedFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  searchFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  createFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType>;
  getSpecificFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType>;
  updateFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType>;
  deleteFeedObject(type: Exclude<SCContributionType, SCContributionType.COMMENT>, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectContributorsList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
  feedObjectSharesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  feedObjectUserSharesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
  restoreFeedObject(type: Exclude<SCContributionType, SCContributionType.COMMENT>, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  relatedFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  voteFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    reaction?: number,
    config?: AxiosRequestConfig
  ): Promise<any>;
  feedObjectVotes(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCVoteType>>;
  feedObjectPollVote(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    choice: number,
    config?: AxiosRequestConfig
  ): Promise<any>;
  feedObjectPollVotesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: FeedObjectPollVotesSearch,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPollVoteType>>;
  followFeedObject(type: Exclude<SCContributionType, SCContributionType.COMMENT>, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectFollowingList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  checkIfFollowingFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectFollowingStatusType>;
  suspendFeedObject(type: Exclude<SCContributionType, SCContributionType.COMMENT>, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  checkIfSuspendedFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectSuspendedStatusType>;
  feedObjectSuspendedList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  flagFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    flag_type: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<any>;
  feedObjectFlagList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>>;
  feedObjectFlagStatus(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>>;
  hideFeedObject(type: Exclude<SCContributionType, SCContributionType.COMMENT>, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectHideStatus(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectHideStatusType>;
}
/**
 * Contains all the endpoints needed to manage feed objs (discussions-posts-statuses).
 */

export class FeedObjectApiClient {
  /**
   * This endpoint retrieves all feed objs
   * @param type
   * @param params
   * @param config
   */
  static getAllFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: FeedObjGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.FeedObjectList.url({type})}?${p.toString()}`, method: Endpoints.FeedObjectList.method});
  }

  /**
   * This endpoint retrieves all uncommented feed objs
   * @param type
   * @param params
   * @param config
   */
  static getUncommentedFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.FeedObjectsUncommented.url({type})}?${p.toString()}`,
      method: Endpoints.FeedObjectsUncommented.method
    });
  }

  /**
   * This endpoint performs search operation to feed objs
   * @param type
   * @param params
   * @param config
   */
  static searchFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchFeedObject.url({type})}?${p.toString()}`, method: Endpoints.SearchFeedObject.method});
  }

  /**
   * This endpoint creates a feed obj
   * @param type
   * @param data
   * @param config
   */
  static createFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return apiRequest({...config, url: Endpoints.CreateFeedObject.url({type}), method: Endpoints.CreateFeedObject.method, data: data});
  }

  /**
   * This endpoint retrieves a specific feed obj using ID
   * @param type
   * @param id
   * @param config
   */
  static getSpecificFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return apiRequest({...config, url: Endpoints.FeedObject.url({type, id}), method: Endpoints.FeedObject.method});
  }

  /**
   * This endpoint updates a specific feed obj
   * @param type
   * @param id
   * @param data
   * @param config
   */
  static updateFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return apiRequest({...config, url: Endpoints.UpdateFeedObject.url({id, type}), method: Endpoints.UpdateFeedObject.method, data: data});
  }

  /**
   * This endpoint deletes a specific feed obj
   * @param type
   * @param id
   * @param config
   */
  static deleteFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteFeedObject.url({type, id}), method: Endpoints.DeleteFeedObject.method});
  }

  /**
   * This endpoint retrieves all contributors for a specific feed obj
   * @param type
   * @param id
   * @param params
   * @param config
   */
  static feedObjectContributorsList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.FeedObjectContributorsList.url({type, id})}?${p.toString()}`,
      method: Endpoints.FeedObjectContributorsList.method
    });
  }

  /**
   * This endpoint retrieves all shares for a specific feed obj
   * @param type
   * @param id
   * @param params
   * @param config
   */
  static feedObjectSharesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.FeedObjectSharesList.url({type, id})}?${p.toString()}`,
      method: Endpoints.FeedObjectSharesList.method
    });
  }

  /**
   * This endpoint retrieves all shares users for a specific feed obj
   * @param type
   * @param id
   * @param params
   * @param config
   */
  static feedObjectUserSharesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.FeedObjectUserSharesList.url({type, id})}?${p.toString()}`,
      method: Endpoints.FeedObjectUserSharesList.method
    });
  }

  /**
   *
   * @param type
   * @param id
   * @param config
   */
  static restoreFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({...config, url: Endpoints.RestoreFeedObject.url({type, id}), method: Endpoints.RestoreFeedObject.method});
  }

  /**
   * This endpoint restores a feed obj
   * @param type
   * @param id
   * @param params
   * @param config
   */
  static relatedFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.RelatedFeedObjects.url({type, id})}?${p.toString()}`,
      method: Endpoints.RelatedFeedObjects.method
    });
  }

  /**
   * This endpoint upvotes a specific feed obj
   * @param type
   * @param id
   * @param config
   * @param reaction
   */
  static voteFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    reaction?: number,
    config?: AxiosRequestConfig
  ): Promise<any> {
    const p = urlParams({...(reaction && {reaction: reaction})});
    return apiRequest({...config, url: `${Endpoints.Vote.url({type, id})}?${p.toString()}`, method: Endpoints.Vote.method});
  }

  /**
   * This endpoint retrieves all votes for a specific feed obj
   * @param type
   * @param id
   * @param params
   * @param config
   */
  static feedObjectVotes(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCVoteType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.VotesList.url({type, id})}?${p.toString()}`, method: Endpoints.VotesList.method});
  }

  /**
   * This endpoint upvotes a specific poll choice in a feed obj
   * @param type It can be only "discussion" or "post".
   * @param id
   * @param choice
   * @param config
   */
  static feedObjectPollVote(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    choice: number,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({...config, url: Endpoints.PollVote.url({type, id}), method: Endpoints.PollVote.method, data: {choice: choice}});
  }

  /**
   * This endpoint retrieves all poll votes for a specific feed obj
   * @param type It can be only "discussion" or "post".
   * @param id
   * @param params
   * @param config
   */
  static feedObjectPollVotesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: FeedObjectPollVotesSearch,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPollVoteType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.PollVotesList.url({type, id})}?${p.toString()}`, method: Endpoints.PollVotesList.method});
  }

  /**
   * This endpoint follows a feed obj
   * @param type
   * @param id
   * @param config
   */
  static followFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({...config, url: Endpoints.FollowContribution.url({id}), method: Endpoints.FollowContribution.method});
  }

  /**
   * This endpoint retrieves all feed objs followed by the authenticated user
   * @param type
   * @param params
   * @param config
   */
  static feedObjectFollowingList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.FeedObjectFollowingList.url({type})}?${p.toString()}`,
      method: Endpoints.FeedObjectFollowingList.method
    });
  }

  /**
   * This endpoint returns following = true if the feed obj (identified in path) is followed by the authenticated user
   * @param type
   * @param id
   * @param config
   */
  static checkIfFollowingFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectFollowingStatusType> {
    return apiRequest({...config, url: Endpoints.CheckIfFollowingFeedObject.url({type, id}), method: Endpoints.CheckIfFollowingFeedObject.method});
  }

  /**
   * This endpoint suspends the notifications for the selected feed obj
   * @param type
   * @param id
   * @param config
   */
  static suspendFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.UserSuspendContributionNotification.url({type, id}),
      method: Endpoints.UserSuspendContributionNotification.method
    });
  }

  /**
   * This endpoint returns suspended = true if the notifications for the feed obj (identified in path) is suspended by the authenticated user
   * @param type
   * @param id
   * @param config
   */
  static checkIfSuspendedFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectSuspendedStatusType> {
    return apiRequest({
      ...config,
      url: Endpoints.UserCheckContributionNotificationSuspended.url({type, id}),
      method: Endpoints.UserCheckContributionNotificationSuspended.method
    });
  }

  /**
   * This endpoint retrieves the list of feed obj which notifications are suspended by the authenticated user
   * @param type
   * @param params
   * @param config
   */
  static feedObjectSuspendedList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.UserListContributionNotificationSuspended.url({type})}?${p.toString()}`,
      method: Endpoints.UserListContributionNotificationSuspended.method
    });
  }

  /**
   * This endpoint flags a specific feed obj
   * @param type
   * @param id
   * @param flag_type
   * @param config
   */
  static flagFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    flag_type: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({...config, url: Endpoints.Flag.url({type, id}), method: Endpoints.Flag.method, data: flag_type});
  }

  /**
   * Retrieves, if exists, a flag for this contribute created by the authenticated user
   * @param type
   * @param id
   * @param config
   */
  static feedObjectFlagStatus(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest({...config, url: Endpoints.FlagStatus.url({type, id}), method: Endpoints.FlagStatus.method});
  }

  /**
   * This endpoint retrieves a list of flags for a specific feed obj
   * @param type
   * @param id
   * @param config
   */
  static feedObjectFlagList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest({...config, url: Endpoints.FeedObjectFlagList.url({type, id}), method: Endpoints.FeedObjectFlagList.method});
  }

  /**
   * This endpoint hides the feed obj for the logged user. The feed obj must be in show state
   * @param type
   * @param id
   * @param config
   */
  static hideFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return apiRequest({...config, url: Endpoints.HideFeedObject.url({type, id}), method: Endpoints.HideFeedObject.method});
  }

  /**
   * This endpoint retrieves if  the feed obj has been hidden by the authenticated user (hidden = true)
   * @param type
   * @param id
   * @param config
   */
  static feedObjectHideStatus(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectHideStatusType> {
    return apiRequest({...config, url: Endpoints.FeedObjectHideStatus.url({type, id}), method: Endpoints.FeedObjectHideStatus.method});
  }
}

/**
 *
 :::tip Feed Object service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {FeedObjectService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllFeedObjects` will return the paginated list of feed objs.

 async getAllFeedObjects(type) {
        return await FeedObjectService.getAllFeedObjects(type);
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
export default class FeedObjectService {
  static async getAllFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: FeedObjGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.getAllFeedObjects(type, params, config);
  }

  static async getUncommentedFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.getUncommentedFeedObjects(type, params, config);
  }

  static async searchFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseSearchParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.searchFeedObject(type, params, config);
  }

  static async createFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.createFeedObject(type, data, config);
  }

  static async getSpecificFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.getSpecificFeedObject(type, id, config);
  }

  static async updateFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.updateFeedObject(type, id, data, config);
  }

  static async deleteFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.deleteFeedObject(type, id, config);
  }

  static async feedObjectContributorsList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return FeedObjectApiClient.feedObjectContributorsList(type, id, params, config);
  }

  static async feedObjectSharesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectSharesList(type, id, params, config);
  }

  static async feedObjectUserSharesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return FeedObjectApiClient.feedObjectUserSharesList(type, id, params);
  }

  static async restoreFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.restoreFeedObject(type, id, config);
  }

  static async relatedFeedObjects(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.relatedFeedObjects(type, id, params, config);
  }

  static async voteFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    reaction?: number,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.voteFeedObject(type, id, reaction, config);
  }
  static async feedObjectVotes(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCVoteType>> {
    return FeedObjectApiClient.feedObjectVotes(type, id, params, config);
  }
  static async feedObjectPollVote(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    choice: number,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.feedObjectPollVote(type, id, choice, config);
  }

  static async feedObjectPollVotesList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    params?: FeedObjectPollVotesSearch,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPollVoteType>> {
    return FeedObjectApiClient.feedObjectPollVotesList(type, id, params, config);
  }

  static async followFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.followFeedObject(type, id, config);
  }

  static async feedObjectFollowingList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectFollowingList(type, params, config);
  }

  static async checkIfFollowingFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectFollowingStatusType> {
    return FeedObjectApiClient.checkIfFollowingFeedObject(type, id, config);
  }

  static async suspendFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.suspendFeedObject(type, id, config);
  }

  static async checkIfSuspendedFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectSuspendedStatusType> {
    return FeedObjectApiClient.checkIfSuspendedFeedObject(type, id, config);
  }
  static async feedObjectSuspendedList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectSuspendedList(type, params, config);
  }

  static async flagFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    flag_type: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.flagFeedObject(type, id, flag_type, config);
  }

  static async feedObjectFlagList(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return FeedObjectApiClient.feedObjectFlagList(type, id, config);
  }

  static async feedObjectFlagStatus(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return FeedObjectApiClient.feedObjectFlagStatus(type, id, config);
  }
  static async hideFeedObject(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return FeedObjectApiClient.hideFeedObject(type, id, config);
  }

  static async feedObjectHideStatus(
    type: Exclude<SCContributionType, SCContributionType.COMMENT>,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectHideStatusType> {
    return FeedObjectApiClient.feedObjectHideStatus(type, id, config);
  }
}
