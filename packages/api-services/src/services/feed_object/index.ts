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

export interface FeedObjectApiClientInterface {
  getAllFeedObjects(type: SCFeedObjectTypologyType, params?: FeedObjGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  getUncommentedFeedObjects(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  searchFeedObject(type: SCFeedObjectTypologyType): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  createFeedObject(type: SCFeedObjectTypologyType, data: FeedObjCreateParams): Promise<SCFeedObjectType>;
  getSpecificFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectType>;
  updateFeedObject(type: SCFeedObjectTypologyType, id: number, data: FeedObjCreateParams): Promise<SCFeedObjectType>;
  deleteFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any>;
  feedObjectContributorsList(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCUserType>>;
  feedObjectSharesList(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  feedObjectUserSharesList(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCUserType>>;
  restoreFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any>;
  relatedFeedObjects(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  voteFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any>;
  feedObjectVotes(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCVoteType>>;
  feedObjectPollVote(type: SCFeedObjectTypologyType, id: number, choice: number): Promise<any>;
  feedObjectPollVotesList(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: FeedObjectPollVotesSearch
  ): Promise<SCPaginatedResponse<SCPollVoteType>>;
  followFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any>;
  feedObjectFollowingList(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  checkIfFollowingFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectFollowingStatusType>;
  suspendFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any>;
  checkIfSuspendedFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectSuspendedStatusType>;
  feedObjectSuspendedList(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>>;
  flagFeedObject(type: SCFeedObjectTypologyType, id: number, flag_type: SCFlagTypeEnum): Promise<any>;
  feedObjectFlagList(type: SCFeedObjectTypologyType, id: number): Promise<SCPaginatedResponse<SCFlagType>>;
  feedObjectFlagStatus(type: SCFeedObjectTypologyType, id: number): Promise<SCPaginatedResponse<SCFlagType>>;
  hideFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any>;
  feedObjectHideStatus(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectHideStatusType>;
}
/**
 * Contains all the endpoints needed to manage feed objs (discussions-posts-statuses).
 */

export class FeedObjectApiClient {
  /**
   * This endpoint retrieves all feed objs
   * @param type
   * @param params
   */
  static getAllFeedObjects(type: SCFeedObjectTypologyType, params?: FeedObjGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.FeedObjectList.url({type})}?${p.toString()}`, Endpoints.FeedObjectList.method);
  }

  /**
   * This endpoint retrieves all uncommented feed objs
   * @param type
   * @param params
   */
  static getUncommentedFeedObjects(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.FeedObjectsUncommented.url({type})}?${p.toString()}`, Endpoints.FeedObjectsUncommented.method);
  }

  /**
   * This endpoint performs search operation to feed objs
   * @param type
   */
  static searchFeedObject(type: SCFeedObjectTypologyType): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return apiRequest(Endpoints.SearchFeedObject.url({type}), Endpoints.SearchFeedObject.method);
  }

  /**
   * This endpoint creates a feed obj
   * @param type
   * @param data
   */
  static createFeedObject(type: SCFeedObjectTypologyType, data: FeedObjCreateParams): Promise<SCFeedObjectType> {
    return apiRequest(Endpoints.CreateFeedObject.url({type}), Endpoints.CreateFeedObject.method, data);
  }

  /**
   * This endpoint retrieves a specific feed obj using ID
   * @param type
   * @param id
   */
  static getSpecificFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectType> {
    return apiRequest(Endpoints.FeedObject.url({type, id}), Endpoints.FeedObject.method);
  }

  /**
   * This endpoint updates a specific feed obj
   * @param type
   * @param id
   * @param data
   */
  static updateFeedObject(type: SCFeedObjectTypologyType, id: number, data: FeedObjCreateParams): Promise<SCFeedObjectType> {
    return apiRequest(Endpoints.UpdateFeedObject.url({id, type}), Endpoints.UpdateFeedObject.method, data);
  }

  /**
   * This endpoint deletes a specific feed obj
   * @param type
   * @param id
   */
  static deleteFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteFeedObject.url({type, id}), Endpoints.DeleteFeedObject.method);
  }

  /**
   * This endpoint retrieves all contributors for a specific feed obj
   * @param type
   * @param id
   * @param params
   */
  static feedObjectContributorsList(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCUserType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.FeedObjectContributorsList.url({type, id})}?${p.toString()}`, Endpoints.FeedObjectContributorsList.method);
  }

  /**
   * This endpoint retrieves all shares for a specific feed obj
   * @param type
   * @param id
   * @param params
   */
  static feedObjectSharesList(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.FeedObjectSharesList.url({type, id})}?${p.toString()}`, Endpoints.FeedObjectSharesList.method);
  }

  /**
   * This endpoint retrieves all shares users for a specific feed obj
   * @param type
   * @param id
   * @param params
   */
  static feedObjectUserSharesList(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCUserType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.FeedObjectUserSharesList.url({type, id})}?${p.toString()}`, Endpoints.FeedObjectUserSharesList.method);
  }

  /**
   *
   * @param type
   * @param id
   */
  static restoreFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return apiRequest(Endpoints.RestoreFeedObject.url({type, id}), Endpoints.RestoreFeedObject.method);
  }

  /**
   * This endpoint restores a feed obj
   * @param type
   * @param id
   * @param params
   */
  static relatedFeedObjects(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.RelatedFeedObjects.url({type, id})}?${p.toString()}`, Endpoints.RelatedFeedObjects.method);
  }

  /**
   * This endpoint upvotes a specific feed obj
   * @param type
   * @param id
   */
  static voteFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return apiRequest(Endpoints.Vote.url({type, id}), Endpoints.Vote.method);
  }

  /**
   * This endpoint retrieves all votes for a specific feed obj
   * @param type
   * @param id
   * @param params
   */
  static feedObjectVotes(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCVoteType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.VotesList.url({type, id})}?${p.toString()}`, Endpoints.VotesList.method);
  }

  /**
   * This endpoint upvotes a specific poll choice in a feed obj
   * @param type It can be only "discussion" or "post".
   * @param id
   * @param choice
   */
  static feedObjectPollVote(type: SCFeedObjectTypologyType, id: number, choice: number): Promise<any> {
    return apiRequest(Endpoints.PollVote.url({type, id}), Endpoints.PollVote.method, {choice: choice});
  }

  /**
   * This endpoint retrieves all poll votes for a specific feed obj
   * @param type It can be only "discussion" or "post".
   * @param id
   * @param params
   */
  static feedObjectPollVotesList(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: FeedObjectPollVotesSearch
  ): Promise<SCPaginatedResponse<SCPollVoteType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.PollVotesList.url({type, id})}?${p.toString()}`, Endpoints.PollVotesList.method);
  }

  /**
   * This endpoint follows a feed obj
   * @param type
   * @param id
   */
  static followFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return apiRequest(Endpoints.FollowContribution.url({id}), Endpoints.FollowContribution.method);
  }

  /**
   * This endpoint retrieves all feed objs followed by the authenticated user
   * @param type
   * @param params
   */
  static feedObjectFollowingList(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.FeedObjectFollowingList.url({type})}?${p.toString()}`, Endpoints.FeedObjectFollowingList.method);
  }

  /**
   * This endpoint returns following = true if the feed obj (identified in path) is followed by the authenticated user
   * @param type
   * @param id
   */
  static checkIfFollowingFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectFollowingStatusType> {
    return apiRequest(Endpoints.CheckIfFollowingFeedObject.url({type, id}), Endpoints.CheckIfFollowingFeedObject.method);
  }

  /**
   * This endpoint suspends the notifications for the selected feed obj
   * @param type
   * @param id
   */
  static suspendFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return apiRequest(Endpoints.UserSuspendContributionNotification.url({type, id}), Endpoints.UserSuspendContributionNotification.method);
  }

  /**
   * This endpoint returns suspended = true if the notifications for the feed obj (identified in path) is suspended by the authenticated user
   * @param type
   * @param id
   */
  static checkIfSuspendedFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectSuspendedStatusType> {
    return apiRequest(
      Endpoints.UserCheckContributionNotificationSuspended.url({type, id}),
      Endpoints.UserCheckContributionNotificationSuspended.method
    );
  }

  /**
   * This endpoint retrieves the list of feed obj which notifications are suspended by the authenticated user
   * @param type
   * @param params
   */
  static feedObjectSuspendedList(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    const p = new URLSearchParams(params);
    return apiRequest(
      `${Endpoints.UserListContributionNotificationSuspended.url({type})}?${p.toString()}`,
      Endpoints.UserListContributionNotificationSuspended.method
    );
  }

  /**
   * This endpoint flags a specific feed obj
   * @param type
   * @param id
   * @param flag_type
   */
  static flagFeedObject(type: SCFeedObjectTypologyType, id: number, flag_type: SCFlagTypeEnum): Promise<any> {
    return apiRequest(Endpoints.Flag.url({type, id}), Endpoints.Flag.method, flag_type);
  }

  /**
   * Retrieves, if exists, a flag for this contribute created by the authenticated user
   * @param type
   * @param id
   */
  static feedObjectFlagStatus(type: SCFeedObjectTypologyType, id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest(Endpoints.FlagStatus.url({type, id}), Endpoints.FlagStatus.method);
  }

  /**
   * This endpoint retrieves a list of flags for a specific feed obj
   * @param type
   * @param id
   */
  static feedObjectFlagList(type: SCFeedObjectTypologyType, id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest(Endpoints.FeedObjectFlagList.url({type, id}), Endpoints.FeedObjectFlagList.method);
  }

  /**
   * This endpoint hides the feed obj for the logged user. The feed obj must be in show state
   * @param type
   * @param id
   */
  static hideFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return apiRequest(Endpoints.HideFeedObject.url({type, id}), Endpoints.HideFeedObject.method);
  }

  /**
   * This endpoint retrieves if the the feed obj has been hidden by the authenticated user (hidden = true)
   * @param type
   * @param id
   */
  static feedObjectHideStatus(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectHideStatusType> {
    return apiRequest(Endpoints.FeedObjectHideStatus.url({type, id}), Endpoints.FeedObjectHideStatus.method);
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
 :::
 */
export default class FeedObjectService {
  static async getAllFeedObjects(type: SCFeedObjectTypologyType, params?: FeedObjGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.getAllFeedObjects(type, params);
  }

  static async getUncommentedFeedObjects(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.getUncommentedFeedObjects(type, params);
  }

  static async searchFeedObject(type: SCFeedObjectTypologyType): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.searchFeedObject(type);
  }

  static async createFeedObject(type: SCFeedObjectTypologyType, data: FeedObjCreateParams): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.createFeedObject(type, data);
  }

  static async getSpecificFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.getSpecificFeedObject(type, id);
  }

  static async updateFeedObject(type: SCFeedObjectTypologyType, id: number, data: FeedObjCreateParams): Promise<SCFeedObjectType> {
    return FeedObjectApiClient.updateFeedObject(type, id, data);
  }

  static async deleteFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return FeedObjectApiClient.deleteFeedObject(type, id);
  }

  static async feedObjectContributorsList(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: BaseGetParams
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return FeedObjectApiClient.feedObjectContributorsList(type, id, params);
  }

  static async feedObjectSharesList(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: BaseGetParams
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectSharesList(type, id, params);
  }

  static async feedObjectUserSharesList(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: BaseGetParams
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return FeedObjectApiClient.feedObjectUserSharesList(type, id, params);
  }

  static async restoreFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return FeedObjectApiClient.restoreFeedObject(type, id);
  }

  static async relatedFeedObjects(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: BaseGetParams
  ): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.relatedFeedObjects(type, id, params);
  }

  static async voteFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return FeedObjectApiClient.voteFeedObject(type, id);
  }
  static async feedObjectVotes(type: SCFeedObjectTypologyType, id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCVoteType>> {
    return FeedObjectApiClient.feedObjectVotes(type, id, params);
  }
  static async feedObjectPollVote(type: SCFeedObjectTypologyType, id: number, choice: number): Promise<any> {
    return FeedObjectApiClient.feedObjectPollVote(type, id, choice);
  }

  static async feedObjectPollVotesList(
    type: SCFeedObjectTypologyType,
    id: number,
    params?: FeedObjectPollVotesSearch
  ): Promise<SCPaginatedResponse<SCPollVoteType>> {
    return FeedObjectApiClient.feedObjectPollVotesList(type, id, params);
  }

  static async followFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return FeedObjectApiClient.followFeedObject(type, id);
  }

  static async feedObjectFollowingList(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectFollowingList(type, params);
  }

  static async checkIfFollowingFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectFollowingStatusType> {
    return FeedObjectApiClient.checkIfFollowingFeedObject(type, id);
  }

  static async suspendFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return FeedObjectApiClient.suspendFeedObject(type, id);
  }

  static async checkIfSuspendedFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectSuspendedStatusType> {
    return FeedObjectApiClient.checkIfSuspendedFeedObject(type, id);
  }
  static async feedObjectSuspendedList(type: SCFeedObjectTypologyType, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedObjectType>> {
    return FeedObjectApiClient.feedObjectSuspendedList(type, params);
  }

  static async flagFeedObject(type: SCFeedObjectTypologyType, id: number, flag_type: SCFlagTypeEnum): Promise<any> {
    return FeedObjectApiClient.flagFeedObject(type, id, flag_type);
  }

  static async feedObjectFlagList(type: SCFeedObjectTypologyType, id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return FeedObjectApiClient.feedObjectFlagList(type, id);
  }

  static async feedObjectFlagStatus(type: SCFeedObjectTypologyType, id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return FeedObjectApiClient.feedObjectFlagStatus(type, id);
  }
  static async hideFeedObject(type: SCFeedObjectTypologyType, id: number): Promise<any> {
    return FeedObjectApiClient.hideFeedObject(type, id);
  }

  static async feedObjectHideStatus(type: SCFeedObjectTypologyType, id: number): Promise<SCFeedObjectHideStatusType> {
    return FeedObjectApiClient.feedObjectHideStatus(type, id);
  }
}
