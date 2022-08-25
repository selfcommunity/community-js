import {apiRequest} from '../../utils/apiRequest';
import {BaseGetParams, FeedObjCreateParams, FeedObjectPollVotesSearch, FeedObjGetParams, SCPaginatedResponse} from '../../types';
import Endpoints from '../../constants/Endpoints';
import {
  SCFeedObjectFollowingStatusType,
  SCFeedObjectHideStatusType,
  SCFeedObjectSuspendedStatusType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
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
    type: SCFeedObjectTypologyType,
    params?: FeedObjGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  getUncommentedFeedObjects(
    type: SCFeedObjectTypologyType,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  searchFeedObject(type: SCFeedObjectTypologyType, search?: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  createFeedObject(type: SCFeedObjectTypologyType, data: FeedObjCreateParams, config?: AxiosRequestConfig): Promise<SCFeedObjectType>;
  getSpecificFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectType>;
  updateFeedObject(type: SCFeedObjectTypologyType, id: number | string, data: FeedObjCreateParams, config?: AxiosRequestConfig): Promise<SCFeedObjectType>;
  deleteFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectContributorsList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
  feedObjectSharesList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  feedObjectUserSharesList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
  restoreFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  relatedFeedObjects(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  voteFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectVotes(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCVoteType>>;
  feedObjectPollVote(type: SCFeedObjectTypologyType, id: number | string, choice: number, config?: AxiosRequestConfig): Promise<any>;
  feedObjectPollVotesList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: FeedObjectPollVotesSearch,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPollVoteType>>;
  followFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectFollowingList(
    type: SCFeedObjectTypologyType,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  checkIfFollowingFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectFollowingStatusType>;
  suspendFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  checkIfSuspendedFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectSuspendedStatusType>;
  feedObjectSuspendedList(
    type: SCFeedObjectTypologyType,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  flagFeedObject(type: SCFeedObjectTypologyType, id: number | string, flag_type: SCFlagTypeEnum, config?: AxiosRequestConfig): Promise<any>;
  feedObjectFlagList(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>>;
  feedObjectFlagStatus(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>>;
  hideFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any>;
  feedObjectHideStatus(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectHideStatusType>;
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
    type: SCFeedObjectTypologyType,
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
    type: SCFeedObjectTypologyType,
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
   * @param search
   * @param config
   */
  static searchFeedObject(
    type: SCFeedObjectTypologyType,
    search?: string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = urlParams({...(search && {search: search})});
    return apiRequest({...config, url: `${Endpoints.SearchFeedObject.url({type})}?${p.toString()}`, method: Endpoints.SearchFeedObject.method});
  }

  /**
   * This endpoint creates a feed obj
   * @param type
   * @param data
   * @param config
   */
  static createFeedObject(type: SCFeedObjectTypologyType, data: FeedObjCreateParams, config?: AxiosRequestConfig): Promise<SCFeedObjectType> {
    return apiRequest({...config, url: Endpoints.CreateFeedObject.url({type}), method: Endpoints.CreateFeedObject.method, data: data});
  }

  /**
   * This endpoint retrieves a specific feed obj using ID
   * @param type
   * @param id
   * @param config
   */
  static getSpecificFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectType> {
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
    type: SCFeedObjectTypologyType,
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
  static deleteFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
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
    type: SCFeedObjectTypologyType,
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
    type: SCFeedObjectTypologyType,
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
    type: SCFeedObjectTypologyType,
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
  static restoreFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
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
    type: SCFeedObjectTypologyType,
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
   */
  static voteFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.Vote.url({type, id}), method: Endpoints.Vote.method});
  }

  /**
   * This endpoint retrieves all votes for a specific feed obj
   * @param type
   * @param id
   * @param params
   * @param config
   */
  static feedObjectVotes(
    type: SCFeedObjectTypologyType,
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
  static feedObjectPollVote(type: SCFeedObjectTypologyType, id: number | string, choice: number, config?: AxiosRequestConfig): Promise<any> {
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
    type: SCFeedObjectTypologyType,
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
  static followFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.FollowContribution.url({id}), method: Endpoints.FollowContribution.method});
  }

  /**
   * This endpoint retrieves all feed objs followed by the authenticated user
   * @param type
   * @param params
   * @param config
   */
  static feedObjectFollowingList(
    type: SCFeedObjectTypologyType,
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
    type: SCFeedObjectTypologyType,
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
  static suspendFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
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
    type: SCFeedObjectTypologyType,
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
    type: SCFeedObjectTypologyType,
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
  static flagFeedObject(type: SCFeedObjectTypologyType, id: number | string, flag_type: SCFlagTypeEnum, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.Flag.url({type, id}), method: Endpoints.Flag.method, data: flag_type});
  }

  /**
   * Retrieves, if exists, a flag for this contribute created by the authenticated user
   * @param type
   * @param id
   * @param config
   */
  static feedObjectFlagStatus(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest({...config, url: Endpoints.FlagStatus.url({type, id}), method: Endpoints.FlagStatus.method});
  }

  /**
   * This endpoint retrieves a list of flags for a specific feed obj
   * @param type
   * @param id
   * @param config
   */
  static feedObjectFlagList(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest({...config, url: Endpoints.FeedObjectFlagList.url({type, id}), method: Endpoints.FeedObjectFlagList.method});
  }

  /**
   * This endpoint hides the feed obj for the logged user. The feed obj must be in show state
   * @param type
   * @param id
   * @param config
   */
  static hideFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.HideFeedObject.url({type, id}), method: Endpoints.HideFeedObject.method});
  }

  /**
   * This endpoint retrieves if  the feed obj has been hidden by the authenticated user (hidden = true)
   * @param type
   * @param id
   * @param config
   */
  static feedObjectHideStatus(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectHideStatusType> {
    return apiRequest({...config, url: Endpoints.FeedObjectHideStatus.url({type, id}), method: Endpoints.FeedObjectHideStatus.method});
  }
}

/**
 *
 :::tipFeed Object service can be used in the following way:

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
    type: SCFeedObjectTypologyType,
    params?: FeedObjGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.getAllFeedObjects(type, params, config);
  }

  static async getUncommentedFeedObjects(
    type: SCFeedObjectTypologyType,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.getUncommentedFeedObjects(type, params, config);
  }

  static async searchFeedObject(
    type: SCFeedObjectTypologyType,
    search?: string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.searchFeedObject(type, search, config);
  }

  static async createFeedObject(type: SCFeedObjectTypologyType, data: FeedObjCreateParams, config?: AxiosRequestConfig): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.createFeedObject(type, data, config);
  }

  static async getSpecificFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.getSpecificFeedObject(type, id, config);
  }

  static async updateFeedObject(
    type: SCFeedObjectTypologyType,
    id: number | string,
    data: FeedObjCreateParams,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.updateFeedObject(type, id, data, config);
  }

  static async deleteFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.deleteFeedObject(type, id, config);
  }

  static async feedObjectContributorsList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return FeedObjectApiClient.feedObjectContributorsList(type, id, params, config);
  }

  static async feedObjectSharesList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectSharesList(type, id, params, config);
  }

  static async feedObjectUserSharesList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return FeedObjectApiClient.feedObjectUserSharesList(type, id, params);
  }

  static async restoreFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.restoreFeedObject(type, id, config);
  }

  static async relatedFeedObjects(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.relatedFeedObjects(type, id, params, config);
  }

  static async voteFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.voteFeedObject(type, id, config);
  }
  static async feedObjectVotes(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCVoteType>> {
    return FeedObjectApiClient.feedObjectVotes(type, id, params, config);
  }
  static async feedObjectPollVote(type: SCFeedObjectTypologyType, id: number | string, choice: number, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.feedObjectPollVote(type, id, choice, config);
  }

  static async feedObjectPollVotesList(
    type: SCFeedObjectTypologyType,
    id: number | string,
    params?: FeedObjectPollVotesSearch,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPollVoteType>> {
    return FeedObjectApiClient.feedObjectPollVotesList(type, id, params, config);
  }

  static async followFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.followFeedObject(type, id, config);
  }

  static async feedObjectFollowingList(
    type: SCFeedObjectTypologyType,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectFollowingList(type, params, config);
  }

  static async checkIfFollowingFeedObject(
    type: SCFeedObjectTypologyType,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectFollowingStatusType> {
    return FeedObjectApiClient.checkIfFollowingFeedObject(type, id, config);
  }

  static async suspendFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.suspendFeedObject(type, id, config);
  }

  static async checkIfSuspendedFeedObject(
    type: SCFeedObjectTypologyType,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCFeedObjectSuspendedStatusType> {
    return FeedObjectApiClient.checkIfSuspendedFeedObject(type, id, config);
  }
  static async feedObjectSuspendedList(
    type: SCFeedObjectTypologyType,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectSuspendedList(type, params, config);
  }

  static async flagFeedObject(type: SCFeedObjectTypologyType, id: number | string, flag_type: SCFlagTypeEnum, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.flagFeedObject(type, id, flag_type, config);
  }

  static async feedObjectFlagList(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>> {
    return FeedObjectApiClient.feedObjectFlagList(type, id, config);
  }

  static async feedObjectFlagStatus(
    type: SCFeedObjectTypologyType,
    id: number | string,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return FeedObjectApiClient.feedObjectFlagStatus(type, id, config);
  }
  static async hideFeedObject(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return FeedObjectApiClient.hideFeedObject(type, id, config);
  }

  static async feedObjectHideStatus(type: SCFeedObjectTypologyType, id: number | string, config?: AxiosRequestConfig): Promise<SCFeedObjectHideStatusType> {
    return FeedObjectApiClient.feedObjectHideStatus(type, id, config);
  }
}
