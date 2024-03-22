import {BaseGetParams, BaseSearchParams, GroupFeedParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCGroupType, SCUserType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';
import {GroupCreateParams} from '../../types';

export interface GroupApiClientInterface {
  getUserGroups(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCGroupType>>;
  searchGroups(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCGroupType>>;
  getSpecificGroupInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCGroupType>;
  getGroupFeed(id: number | string, params?: GroupFeedParams, config?: AxiosRequestConfig): Promise<any>;
  createGroup(data: GroupCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCGroupType>;
  updateGroup(id: number | string, data: SCGroupType, config?: AxiosRequestConfig): Promise<SCGroupType>;
  patchGroup(id: number | string, data: SCGroupType, config?: AxiosRequestConfig): Promise<SCGroupType>;
  changeGroupAvatarOrCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCGroupType>;
  getGroupMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getGroupSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getGroupsSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getGroupInvitedUsers(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  subscribeToGroup(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  unsubscribeFromGroup(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  inviteOrAcceptGroupRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any>;
  getGroupSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  getGroupWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>>;
}
/**
 * Contains all the endpoints needed to manage groups.
 */

export class GroupApiClient {
  /**
   * This endpoint retrieves all the groups of the logged-in user.
   * @param params
   * @param config
   */
  static getUserGroups(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCGroupType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetUserGroups.url({})}?${p.toString()}`, method: Endpoints.GetUserGroups.method});
  }

  /**
   * This endpoint performs groups search
   * @param params
   * @param config
   */
  static searchGroups(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCGroupType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchGroups.url({})}?${p.toString()}`, method: Endpoints.SearchGroups.method});
  }

  /**
   * This endpoint retrieves a specific group.
   * @param id
   * @param config
   */
  static getSpecificGroupInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return apiRequest({...config, url: Endpoints.GetGroupInfo.url({id}), method: Endpoints.GetGroupInfo.method});
  }

  /**
   * This endpoint performs groups search
   * @param id
   * @param params
   * @param config
   */
  static getGroupFeed(id: number | string, params?: GroupFeedParams, config?: AxiosRequestConfig): Promise<any> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetGroupFeed.url({id})}?${p.toString()}`, method: Endpoints.GetGroupFeed.method});
  }

  /**
   * This endpoint creates a group.
   * @param data
   * @param config
   */
  static createGroup(data: GroupCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return apiRequest({...config, url: Endpoints.CreateGroup.url({}), method: Endpoints.CreateGroup.method, data: data});
  }

  /**
   * This endpoint updates a group.
   * @param id
   * @param data
   * @param config
   */
  static updateGroup(id: number | string, data: SCGroupType, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return apiRequest({...config, url: Endpoints.UpdateGroup.url({id}), method: Endpoints.UpdateGroup.method, data: data});
  }

  /**
   * This endpoint patches a  group.
   * @param id
   * @param data
   * @param config
   */
  static patchGroup(id: number | string, data: SCGroupType, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return apiRequest({...config, url: Endpoints.PatchGroup.url({id}), method: Endpoints.PatchGroup.method, data: data});
  }
  /**
   * This endpoint changes the group avatar
   * @param id
   * @param data
   * @param config
   */
  static changeGroupAvatarOrCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return apiRequest({url: Endpoints.PatchGroup.url({id}), method: Endpoints.PatchGroup.method, data, ...config});
  }
  /**
   * This endpoint returns all subscribers of a specific group.
   * @param id
   * @param params
   * @param config
   */
  static getGroupMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetGroupSubscribers.url({id})}?${p.toString()}`, method: Endpoints.GetGroupSubscribers.method});
  }

  /**
   * This endpoint returns a list of suggested users to invite to the group.
   * @param id
   * @param search
   * @param config
   */
  static getGroupSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetGroupSuggestedUsers.url({id, search}),
      method: Endpoints.GetGroupSuggestedUsers.method
    });
  }

  /**
   * This endpoint returns a list of suggested users to invite to the groups.
   * @param search
   * @param config
   */
  static getGroupsSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.GetGroupsSuggestedUsers.url({search}),
      method: Endpoints.GetGroupsSuggestedUsers.method
    });
  }

  /**
   * This endpoint returns a list of invited users.
   * @param id
   * @param config
   */
  static getGroupInvitedUsers(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({...config, url: Endpoints.GetGroupInvitedUsers.url({id}), method: Endpoints.GetGroupInvitedUsers.method});
  }

  /**
   * This endpoint subscribes to a group.
   * @param id
   * @param config
   */
  static subscribeToGroup(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.SubscribeToGroup.url({id}), method: Endpoints.SubscribeToGroup.method});
  }

  /**
   * This endpoint unsubscribes from a group.
   * @param id
   * @param config
   */
  static unsubscribeFromGroup(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.UnsubscribeFromGroup.url({id}), method: Endpoints.UnsubscribeFromGroup.method});
  }

  /**
   * This endpoint allows to invite or accept a group invite.
   * @param id
   * @param data
   * @param config
   */
  static inviteOrAcceptGroupRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      ...config,
      url: Endpoints.InviteOrAcceptGroupRequest.url({id}),
      method: Endpoints.InviteOrAcceptGroupRequest.method,
      data: data
    });
  }
  /**
   * This endpoint retrieves the group subscription status.
   * @param id
   * @param config
   */
  static getGroupSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.GetGroupSubscriptionStatus.url({id}), method: Endpoints.GetGroupSubscriptionStatus.method});
  }
  /**
   * This endpoint returns a list of the users waiting to be added to the group.
   * @param id
   * @param params
   * @param config
   */
  static getGroupWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    const p = urlParams(params);
    return apiRequest({
      ...config,
      url: `${Endpoints.GetGroupWaitingApprovalSubscribers.url({id})}?${p.toString()}`,
      method: Endpoints.GetGroupWaitingApprovalSubscribers.method
    });
  }
}

/**
 *
 :::tip Incubator service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {GroupService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `searchGroups` will return the groups matching the search query.

 async searchGroups() {
         return await GroupService.searchGroups();
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificGroupInfo(groupId) {
         return await GroupService.getSpecificGroupInfo(groupId);
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
export default class GroupService {
  static async getUserGroups(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCGroupType>> {
    return GroupApiClient.getUserGroups(params, config);
  }
  static async searchGroups(params?: BaseSearchParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCGroupType>> {
    return GroupApiClient.searchGroups(params, config);
  }
  static async getSpecificGroupInfo(id: number | string, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return GroupApiClient.getSpecificGroupInfo(id, config);
  }
  static async getGroupFeed(id: number | string, params?: GroupFeedParams, config?: AxiosRequestConfig): Promise<any> {
    return GroupApiClient.getGroupFeed(id, params, config);
  }
  static async createGroup(data: GroupCreateParams | FormData, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return GroupApiClient.createGroup(data, config);
  }
  static async updateGroup(id: number | string, data: SCGroupType, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return GroupApiClient.updateGroup(id, data, config);
  }
  static async patchGroup(id: number | string, data: SCGroupType, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return GroupApiClient.patchGroup(id, data, config);
  }
  static async changeGroupAvatarOrCover(id: number | string, data: FormData, config?: AxiosRequestConfig): Promise<SCGroupType> {
    return GroupApiClient.changeGroupAvatarOrCover(id, data, config);
  }
  static async getGroupMembers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return GroupApiClient.getGroupMembers(id, params, config);
  }
  static async getGroupSuggestedUsers(id: number | string, search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return GroupApiClient.getGroupSuggestedUsers(id, search, config);
  }
  static async getGroupsSuggestedUsers(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return GroupApiClient.getGroupsSuggestedUsers(search, config);
  }
  static async getGroupInvitedUsers(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return GroupApiClient.getGroupInvitedUsers(id, config);
  }
  static async subscribeToGroup(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return GroupApiClient.subscribeToGroup(id, config);
  }
  static async unsubscribeFromGroup(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return GroupApiClient.unsubscribeFromGroup(id, config);
  }
  static async inviteOrAcceptGroupRequest(id: number | string, data: {users: number[]}, config?: AxiosRequestConfig): Promise<any> {
    return GroupApiClient.inviteOrAcceptGroupRequest(id, data, config);
  }
  static async getGroupSubscriptionStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<any>> {
    return GroupApiClient.getGroupSubscriptionStatus(id, config);
  }
  static async getGroupWaitingApprovalSubscribers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return GroupApiClient.getGroupWaitingApprovalSubscribers(id, params, config);
  }
}
