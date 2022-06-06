import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {
  SCUserAutocompleteType,
  SCUserType,
  SCUserCounterType,
  SCUserSettingsType,
  SCUserChangeEmailType,
  SCUserAvatarType,
  SCUserPermissionType,
  SCPlatformType,
  SCCategoryType,
  SCFeedUnitType,
  SCUserFollowedStatusType,
  SCUserFollowerStatusType,
  SCUserConnectionStatusType,
  SCUserHiddenStatusType,
  SCUserConnectionRequestType,
  SCTagType,
  SCUserLoyaltyPointsType,
  SCUserEmailTokenType,
  SCUserHiddenByStatusType,
  SCAvatarType,
  SCMediaType
} from '@selfcommunity/types';
import {SCPaginatedResponse, UserAutocompleteParams, UserSearchParams} from '../../types';

export interface UserApiClientInterface {
  getAllUsers(token: string, params?: any): Promise<SCPaginatedResponse<SCUserType>>;
  getHiddenUsers(token: string, params?: any): Promise<SCPaginatedResponse<SCUserType>>;
  userAutocomplete(token: string, params: UserAutocompleteParams): Promise<SCPaginatedResponse<SCUserAutocompleteType>>;
  userSearch(token: string, params: UserSearchParams): Promise<SCPaginatedResponse<SCUserType>>;
  getSpecificUser(token: string, id: number): Promise<SCUserType>;
  getUserCounters(id: number, token?: string): Promise<SCUserCounterType>;
  userUpdate(token: string, id: number, data?: SCUserType): Promise<SCUserType>;
  userPatch(token: string, id: number, data?: SCUserType): Promise<SCUserType>;
  userDelete(token: string, id: number, hard?: number): Promise<any>;
  changeUserMail(token: string, id: number, new_email: string, confirm?: boolean): Promise<any | SCUserChangeEmailType>;
  confirmChangeUserMail(token: string, id: number, new_email: string, validation_code?: string): Promise<any>;
  changeUserPassword(token: string, id: number, password: string, new_password: string): Promise<any>;
  userSettings(token: string, id: number): Promise<SCUserSettingsType>;
  userSettingsPatch(token: string, id: number, data?: SCUserSettingsType): Promise<SCUserSettingsType>;
  getCurrentUser(token: string): Promise<SCUserType>;
  getCurrentUserAvatar(token: string): Promise<SCUserAvatarType>;
  getCurrentUserPermission(token: string): Promise<SCUserPermissionType>;
  getCurrentUserPlatform(token: string): Promise<SCPlatformType>;
  getUserFollowedCategories(id: number, mutual?: number): Promise<SCCategoryType[]>;
  getUserFeed(id: number, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getUserFollowers(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>>;
  getUserFollowed(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>>;
  followUser(id: number, token: string): Promise<any>;
  checkUserFollowed(token: string, id: number): Promise<SCUserFollowedStatusType>;
  checkUserFollower(token: string, id: number): Promise<SCUserFollowerStatusType>;
  getUserConnections(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>>;
  checkUserConnections(token: string, id: number): Promise<SCUserConnectionStatusType>;
  getUserConnectionRequests(token: string, id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>>;
  getUserRequestConnectionsSent(token: string, id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>>;
  userAcceptRequestConnection(token: string, id: number): Promise<any>;
  userRequestConnection(token: string, id: number): Promise<any>;
  userRemoveConnection(token: string, id: number): Promise<any>;
  userCancelRejectConnectionRequest(token: string, id: number): Promise<any>;
  userCancelRequestConnection(token: string, id: number): Promise<any>;
  userRejectConnectionRequest(token: string, id: number): Promise<any>;
  userMarkSeenConnectionRequest(token: string, id: number): Promise<any>;
  showHideUser(token: string, id: number): Promise<any>;
  checkUserHidden(token: string, id: number): Promise<SCUserHiddenStatusType>;
  checkUserHiddenBy(token: string, id: number): Promise<SCUserHiddenByStatusType>;
  getUserLoyaltyPoints(token: string, id: number): Promise<SCUserLoyaltyPointsType>;
  getUserConnectionStatuses(token: string, users: number[]): Promise<any>;
  userTagToAddressContribution(token: string): Promise<SCTagType>;
  checkUserEmailToken(token: string, email_token: string): Promise<SCUserEmailTokenType>;
  addUserAvatar(token: string, avatar: SCMediaType): Promise<SCAvatarType>;
  getUserAvatars(token: string): Promise<SCPaginatedResponse<SCAvatarType>>;
  removeUserAvatar(token: string, avatar_id: number): Promise<any>;
  setUserPrimaryAvatar(token: string, avatar_id: number): Promise<any>;
}

/**
 * Contains all the endpoints needed to manage users.
 */
export class UserApiClient {
  /**
   * This endpoint retrieves the list of all users
   * @param token
   * @param params
   */
  static getAllUsers(token: string, params?: any): Promise<SCPaginatedResponse<SCUserType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.UserList.url({})}?${p.toString()}`, Endpoints.UserList.method, token);
  }

  /**
   * This endpoint retrieves the list of all users hidden by the authenticated user
   * @param token
   * @param params
   */
  static getHiddenUsers(token: string, params?: any): Promise<SCPaginatedResponse<SCUserType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.ListHiddenUsers.url({})}?${p.toString()}`, Endpoints.ListHiddenUsers.method, token);
  }

  /**
   * This endpoint retrieves the list of all users that meet the search criteria. The user object returned will contain only the following attributes: id, username, real_name, ext_id and avatar.
   * This endpoint is recommended for implementing an autocomplete input field.
   * @param token
   * @param params
   */
  static userAutocomplete(token: string, params: UserAutocompleteParams): Promise<SCPaginatedResponse<SCUserAutocompleteType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.UserAutocomplete.url({})}?${p.toString()}`, Endpoints.UserAutocomplete.method, token);
  }

  /**
   * This endpoint performs users search.
   * @param token
   * @param params
   */
  static userSearch(token: string, params: UserSearchParams): Promise<SCPaginatedResponse<SCUserType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.UserSearch.url({})}?${p.toString()}`, Endpoints.UserSearch.method, token);
  }

  /**
   * This endpoint retrieves a specific user's profile identified by ID.
   * @param token
   * @param id
   */
  static getSpecificUser(token: string, id: number): Promise<SCUserType> {
    return apiRequest(Endpoints.User.url({id}), Endpoints.User.method, token);
  }

  /**
   * This endpoint retrieves the counters of a specific user identified by Id.
   * @param id
   * @param token
   */
  static getUserCounters(id: number, token?: string): Promise<SCUserCounterType> {
    return apiRequest(Endpoints.UserCounters.url({id}), Endpoints.UserCounters.method, token);
  }

  /**
   * This endpoint updates the profile of a user identified by ID. A user can only update their personal data.
   * If the request will update the avatar or the cover the 'Content-Type' request header must be set as 'multipart/form-data', otherwise it can be 'application/x-www-form-urlencoded'.
   * @param token
   * @param id
   * @param data
   */
  static userUpdate(token: string, id: number, data?: SCUserType): Promise<SCUserType> {
    return apiRequest(Endpoints.UserUpdate.url({id}), Endpoints.UserUpdate.method, token, data);
  }

  /**
   * This endpoint patches a specific user identified by {id}
   * @param token
   * @param id
   * @param data
   */
  static userPatch(token: string, id: number, data?: SCUserType): Promise<SCUserType> {
    return apiRequest(Endpoints.UserPatch.url({id}), Endpoints.UserPatch.method, token, data);
  }

  /**
   * This endpoint deletes a specific user identified by {id}
   * @param token
   * @param id
   * @param hard
   */
  static userDelete(token: string, id: number, hard?: number): Promise<any> {
    return apiRequest(`${Endpoints.UserDelete.url({id})}?${hard.toString()}`, Endpoints.UserDelete.method, token);
  }

  /**
   * This endpoint changes the email of the authenticated user.
   * @param token
   * @param id
   * @param new_email
   * @param confirm
   */
  static changeUserMail(token: string, id: number, new_email: string, confirm?: boolean): Promise<any | SCUserChangeEmailType> {
    return apiRequest(Endpoints.ChangeUserMail.url({id}), Endpoints.ChangeUserMail.method, token, {
      new_email: new_email,
      confirm: confirm
    });
  }

  /**
   * This endpoint confirms email change.
   * @param token
   * @param id
   * @param new_email
   * @param validation_code
   */
  static confirmChangeUserMail(token: string, id: number, new_email: string, validation_code?: string): Promise<any> {
    return apiRequest(Endpoints.ConfirmUserChangeMail.url({id}), Endpoints.ConfirmUserChangeMail.method, token, {
      new_email: new_email,
      validation_code: validation_code
    });
  }

  /**
   * This endpoint changes the password of the authenticated user.
   * @param token
   * @param id
   * @param password
   * @param new_password
   */
  static changeUserPassword(token: string, id: number, password: string, new_password: string): Promise<any> {
    return apiRequest(Endpoints.ChangeUserPassword.url({id}), Endpoints.ChangeUserPassword.method, token, {
      password: password,
      new_password: new_password
    });
  }

  /**
   * This endpoint retrieves all current user's settings for the authenticated user.
   * @param token
   * @param id
   */
  static userSettings(token: string, id: number): Promise<SCUserSettingsType> {
    return apiRequest(Endpoints.UserSettings.url({id}), Endpoints.UserSettings.method, token);
  }

  /**
   * This endpoint changes the user settings for the authenticated user.
   * @param token
   * @param id
   * @param data
   */
  static userSettingsPatch(token: string, id: number, data?: SCUserSettingsType): Promise<SCUserSettingsType> {
    return apiRequest(Endpoints.UserSettingsPatch.url({id}), Endpoints.UserSettingsPatch.method, token, data ?? null);
  }

  /**
   * This endpoint returns the user identified by the authentication token.
   * @param token
   */
  static getCurrentUser(token: string): Promise<SCUserType> {
    return apiRequest(Endpoints.Me.url(), Endpoints.Me.method, token);
  }

  /**
   * This endpoint returns the url to the user's current avatar.
   * @param token
   */
  static getCurrentUserAvatar(token: string): Promise<SCUserAvatarType> {
    return apiRequest(Endpoints.MyAvatar.url({}), Endpoints.MyAvatar.method, token);
  }

  /**
   * This endpoint returns a list of permissions for the user identified by the authentication token. Some of the permissions in the list depend on global community settings.
   * @param token
   */
  static getCurrentUserPermission(token: string): Promise<SCUserPermissionType> {
    return apiRequest(Endpoints.Permission.url({}), Endpoints.Permission.method, token);
  }

  /**
   * This endpoint retrieves the platform url starting from the Authorization user token. Using this url, the logged user (must be a staff member) can access the platform to manage the community.
   * @param token
   */
  static getCurrentUserPlatform(token: string): Promise<SCPlatformType> {
    return apiRequest(Endpoints.Platform.url({}), Endpoints.Platform.method, token);
  }

  /**
   * This endpoint gets the list of categories followed by the user.
   * @param id
   * @param mutual
   */
  static getUserFollowedCategories(id: number, mutual?: number): Promise<SCCategoryType[]> {
    return apiRequest(Endpoints.FollowedCategories.url({id, mutual}), Endpoints.FollowedCategories.method);
  }

  /**
   * This endpoint retrieves the list of posts of the user identified by {id}
   * @param id
   * @param token
   */
  static getUserFeed(id: number, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.UserFeed.url({id}), Endpoints.UserFeed.method, token);
  }

  /**
   * This endpoint retrieves the list of followers of a specific user identified by {id}
   * @param id
   * @param mutual
   * @param token
   */
  static getUserFollowers(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.UserFollowers.url({id, mutual}), Endpoints.UserFollowers.method, token);
  }

  /**
   * This endpoint retrieves the list of following of a specific user identified by {id}.
   * @param id
   * @param mutual
   * @param token
   */
  static getUserFollowed(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.UsersFollowed.url({id, mutual}), Endpoints.UsersFollowed.method, token);
  }

  /**
   * This endpoint allows a user to follow another user identified by {id}
   * @param id
   * @param token
   */
  static followUser(id: number, token: string): Promise<any> {
    return apiRequest(Endpoints.FollowUser.url({id}), Endpoints.FollowUser.method, token);
  }

  /**
   * This endpoint returns is_followed = true if the user (identified in path) is followed by me.
   * @param token
   * @param id
   */
  static checkUserFollowed(token: string, id: number): Promise<SCUserFollowedStatusType> {
    return apiRequest(Endpoints.CheckUserFollowed.url({id}), Endpoints.CheckUserFollowed.method, token);
  }

  /**
   * This endpoint returns is_follower = true if the user (identified in path) follow me
   * @param token
   * @param id
   */
  static checkUserFollower(token: string, id: number): Promise<SCUserFollowerStatusType> {
    return apiRequest(Endpoints.CheckUserFollower.url({id}), Endpoints.CheckUserFollower.method, token);
  }

  /**
   * This endpoint retrieves the list of connections of a specific user identified by ID.
   * @param id
   * @param mutual
   * @param token
   */
  static getUserConnections(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(`${Endpoints.UserConnections.url({id})}?${mutual.toString()}`, Endpoints.UserConnections.method, token);
  }

  /**
   * This endpoint returns is_connection = true if the user (identified in path) is connected with me.
   * @param token
   * @param id
   */
  static checkUserConnections(token: string, id: number): Promise<SCUserConnectionStatusType> {
    return apiRequest(Endpoints.UserCheckConnection.url({id}), Endpoints.UserCheckConnection.method, token);
  }

  /**
   * This endpoint retrieves the list of connection requests received by a specific user identified by ID.
   * @param token
   * @param id
   */
  static getUserConnectionRequests(token: string, id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return apiRequest(Endpoints.UserConnectionRequests.url({id}), Endpoints.UserConnectionRequests.method, token);
  }

  /**
   * This endpoint retrieves a specific user's list of connection requests sent by user.
   * @param token
   * @param id
   */
  static getUserRequestConnectionsSent(token: string, id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return apiRequest(Endpoints.UserRequestConnectionsSent.url({id}), Endpoints.UserRequestConnectionsSent.method, token);
  }

  /**
   * This endpoint accepts a request connection of the user identified by {id}
   * @param token
   * @param id
   */
  static userAcceptRequestConnection(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserAcceptRequestConnection.url({id}), Endpoints.UserAcceptRequestConnection.method, token);
  }

  /**
   * This endpoint requests a connection to the user identified by {id}
   * @param token
   * @param id
   */
  static userRequestConnection(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserRequestConnection.url({id}), Endpoints.UserRequestConnection.method, token);
  }

  /**
   * This endpoint removes connection with the user identified by {id}
   * @param token
   * @param id
   */
  static userRemoveConnection(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserRemoveConnection.url({id}), Endpoints.UserRemoveConnection.method, token);
  }

  /**
   * This endpoint cancels reject connection to a user identified by {id}
   * @param token
   * @param id
   */
  static userCancelRejectConnectionRequest(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserCancelRejectConnectionRequest.url({id}), Endpoints.UserCancelRejectConnectionRequest.method, token);
  }

  /**
   * This endpoint cancels a request connection for a user.
   * @param token
   * @param id
   */
  static userCancelRequestConnection(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserCancelRequestConnection.url({id}), Endpoints.UserCancelRequestConnection.method, token);
  }

  /**
   * This endpoint rejects a connection request sent from user identified by {id}
   * @param token
   * @param id
   */
  static userRejectConnectionRequest(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserRejectConnectionRequest.url({id}), Endpoints.UserRejectConnectionRequest.method, token);
  }

  /**
   * This endpoint marks seen a connection request of user identified by {id} for the authenticated user.
   * @param token
   * @param id
   */
  static userMarkSeenConnectionRequest(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserMarkSeenConnectionRequest.url({id}), Endpoints.UserMarkSeenConnectionRequest.method, token);
  }

  /**
   * This endpoint shows/hides a user (and its posts) identified by {id} for the authenticated user.
   * @param token
   * @param id
   */
  static showHideUser(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.UserShowHide.url({id}), Endpoints.UserShowHide.method, token);
  }

  /**
   * This endpoint returns true if the user (identified in path) is hidden by the authenticated user.
   * @param token
   * @param id
   */
  static checkUserHidden(token: string, id: number): Promise<SCUserHiddenStatusType> {
    return apiRequest(Endpoints.CheckUserHidden.url({id}), Endpoints.CheckUserHidden.method, token);
  }

  /**
   * This endpoint returns true if the user (identified in path) has hidden by the authenticated user.
   * @param token
   * @param id
   */
  static checkUserHiddenBy(token: string, id: number): Promise<SCUserHiddenByStatusType> {
    return apiRequest(Endpoints.CheckUserHiddenBy.url({id}), Endpoints.CheckUserHiddenBy.method, token);
  }

  /**
   * This endpoint returns user's loyalty points.
   * @param token
   * @param id
   */
  static getUserLoyaltyPoints(token: string, id: number): Promise<SCUserLoyaltyPointsType> {
    return apiRequest(Endpoints.GetUserLoyaltyPoints.url({id}), Endpoints.GetUserLoyaltyPoints.method, token);
  }

  /**
   * This endpoint lists the connection/follow statuses of the logged user starting from a users array.
   * @param token
   * @param users
   */
  static getUserConnectionStatuses(token: string, users: number[]): Promise<any> {
    return apiRequest(Endpoints.UserConnectionStatuses.url({}), Endpoints.UserConnectionStatuses.method, token, {users: users});
  }

  /**
   * This endpoint returns user's tags to address a contribution.
   * @param token
   */
  static userTagToAddressContribution(token: string): Promise<SCTagType> {
    return apiRequest(Endpoints.UserTagToAddressContribution.url({}), Endpoints.UserTagToAddressContribution.method, token);
  }

  /**
   * This endpoint checks an email token.
   * @param token
   * @param email_token
   */
  static checkUserEmailToken(token: string, email_token: string): Promise<SCUserEmailTokenType> {
    const p = new URLSearchParams({email_token: email_token});
    return apiRequest(`${Endpoints.CheckEmailToken.url({})}?${p.toString()}`, Endpoints.CheckEmailToken.method, token);
  }

  /**
   * This endpoint adds an avatar to my avatars.
   * @param token
   * @param avatar
   */
  static addUserAvatar(token: string, avatar: SCMediaType): Promise<SCAvatarType> {
    return apiRequest(Endpoints.AddAvatar.url({}), Endpoints.AddAvatar.method, token, {avatar: avatar});
  }

  /**
   * This endpoint retrieves all user avatars.
   * @param token
   */
  static getUserAvatars(token: string): Promise<SCPaginatedResponse<SCAvatarType>> {
    return apiRequest(Endpoints.GetAvatars.url({}), Endpoints.GetAvatars.method, token);
  }

  /**
   * This endpoint removes/deletes an avatar from the authenticated user avatars.
   * @param token
   * @param avatar_id
   */
  static removeUserAvatar(token: string, avatar_id: number): Promise<any> {
    return apiRequest(Endpoints.RemoveAvatar.url({}), Endpoints.RemoveAvatar.method, token, {avatar_id: avatar_id});
  }

  /**
   * This endpoint sets the primary avatar for the authenticated user.
   * @param token
   * @param avatar_id
   */
  static setUserPrimaryAvatar(token: string, avatar_id: number): Promise<any> {
    return apiRequest(Endpoints.SetPrimaryAvatar.url({}), Endpoints.SetPrimaryAvatar.method, token, {avatar_id: avatar_id});
  }
}

export default class UserService {
  static async getAllUsers(token: string, params?: any): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getAllUsers(token, params);
  }
  static async getHiddenUsers(token: string, params?: any): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getHiddenUsers(token, params);
  }
  static async userAutocomplete(token: string, params: UserAutocompleteParams): Promise<SCPaginatedResponse<SCUserAutocompleteType>> {
    return UserApiClient.userAutocomplete(token, params);
  }
  static async userSearch(token: string, params: UserSearchParams): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.userSearch(token, params);
  }
  static async getSpecificUser(token: string, id: number): Promise<SCUserType> {
    return UserApiClient.getSpecificUser(token, id);
  }
  static async getUserCounters(id: number, token?: string): Promise<SCUserCounterType> {
    return UserApiClient.getUserCounters(id, token);
  }
  static async userUpdate(token: string, id: number, data?: SCUserType): Promise<SCUserType> {
    return UserApiClient.userUpdate(token, id, data);
  }
  static async userPatch(token: string, id: number, data?: SCUserType): Promise<SCUserType> {
    return UserApiClient.userPatch(token, id, data);
  }
  static async userDelete(token: string, id: number, hard?: number): Promise<any> {
    return UserApiClient.userDelete(token, id, hard);
  }
  static async changeUserMail(token: string, id: number, new_email: string, confirm?: boolean): Promise<any | SCUserChangeEmailType> {
    return UserApiClient.changeUserMail(token, id, new_email, confirm);
  }
  static async confirmChangeUserMail(token: string, id: number, new_email: string, validation_code?: string): Promise<any> {
    return UserApiClient.confirmChangeUserMail(token, id, new_email, validation_code);
  }
  static async changeUserPassword(token: string, id: number, password: string, new_password: string): Promise<any> {
    return UserApiClient.changeUserPassword(token, id, password, new_password);
  }
  static async userSettings(token: string, id: number): Promise<SCUserSettingsType> {
    return UserApiClient.userSettings(token, id);
  }
  static async userSettingsPatch(token: string, id: number, data?: SCUserSettingsType): Promise<SCUserSettingsType> {
    return UserApiClient.userSettingsPatch(token, id, data);
  }
  static async getCurrentUser(token: string): Promise<SCUserType> {
    return UserApiClient.getCurrentUser(token);
  }
  static async getCurrentUserAvatar(token: string): Promise<SCUserAvatarType> {
    return UserApiClient.getCurrentUserAvatar(token);
  }
  static async getCurrentUserPermission(token: string): Promise<SCUserPermissionType> {
    return UserApiClient.getCurrentUserPermission(token);
  }
  static async getCurrentUserPlatform(token: string): Promise<SCPlatformType> {
    return UserApiClient.getCurrentUserPlatform(token);
  }
  static async getUserFollowedCategories(id: number, mutual?: number): Promise<SCCategoryType[]> {
    return UserApiClient.getUserFollowedCategories(id, mutual);
  }
  static async getUserFeed(id: number, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return UserApiClient.getUserFeed(id, token);
  }
  static async getUserFollowers(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserFollowers(id, mutual, token);
  }
  static async getUserFollowed(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserFollowed(id, mutual, token);
  }
  static async followUser(id: number, token: string): Promise<any> {
    return UserApiClient.followUser(id, token);
  }
  static async checkUserFollowed(token: string, id: number): Promise<SCUserFollowedStatusType> {
    return UserApiClient.checkUserFollowed(token, id);
  }
  static async checkUserFollower(token: string, id: number): Promise<SCUserFollowerStatusType> {
    return UserApiClient.checkUserFollower(token, id);
  }
  static async getUserConnections(id: number, mutual?: number, token?: string): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserConnections(id, mutual, token);
  }
  static async checkUserConnections(token: string, id: number): Promise<SCUserConnectionStatusType> {
    return UserApiClient.checkUserConnections(token, id);
  }
  static async getUserConnectionRequests(token: string, id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return UserApiClient.getUserConnectionRequests(token, id);
  }
  static async getUserRequestConnectionsSent(token: string, id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return UserApiClient.getUserRequestConnectionsSent(token, id);
  }
  static async userAcceptRequestConnection(token: string, id: number): Promise<any> {
    return UserApiClient.userAcceptRequestConnection(token, id);
  }
  static async userRequestConnection(token: string, id: number): Promise<any> {
    return UserApiClient.userRequestConnection(token, id);
  }
  static async userRemoveConnection(token: string, id: number): Promise<any> {
    return UserApiClient.userRemoveConnection(token, id);
  }
  static async userCancelRejectConnectionRequest(token: string, id: number): Promise<any> {
    return UserApiClient.userCancelRejectConnectionRequest(token, id);
  }
  static async userCancelRequestConnection(token: string, id: number): Promise<any> {
    return UserApiClient.userCancelRequestConnection(token, id);
  }
  static async userRejectConnectionRequest(token: string, id: number): Promise<any> {
    return UserApiClient.userRejectConnectionRequest(token, id);
  }
  static async userMarkSeenConnectionRequest(token: string, id: number): Promise<any> {
    return UserApiClient.userMarkSeenConnectionRequest(token, id);
  }
  static async showHideUser(token: string, id: number): Promise<any> {
    return UserApiClient.showHideUser(token, id);
  }
  static async checkUserHidden(token: string, id: number): Promise<SCUserHiddenStatusType> {
    return UserApiClient.checkUserHidden(token, id);
  }
  static async checkUserHiddenBy(token: string, id: number): Promise<SCUserHiddenByStatusType> {
    return UserApiClient.checkUserHiddenBy(token, id);
  }
  static async getUserLoyaltyPoints(token: string, id: number): Promise<SCUserLoyaltyPointsType> {
    return UserApiClient.getUserLoyaltyPoints(token, id);
  }
  static async getUserConnectionStatuses(token: string, users: number[]): Promise<any> {
    return UserApiClient.getUserConnectionStatuses(token, users);
  }
  static async userTagToAddressContribution(token: string): Promise<SCTagType> {
    return UserApiClient.userTagToAddressContribution(token);
  }
  static async checkUserEmailToken(token: string, email_token: string): Promise<SCUserEmailTokenType> {
    return UserApiClient.checkUserEmailToken(token, email_token);
  }
  static async addUserAvatar(token: string, avatar: SCMediaType): Promise<SCAvatarType> {
    return UserApiClient.addUserAvatar(token, avatar);
  }
  static async getUserAvatars(token: string): Promise<SCPaginatedResponse<SCAvatarType>> {
    return UserApiClient.getUserAvatars(token);
  }
  static async removeUserAvatar(token: string, avatar_id: number): Promise<any> {
    return UserApiClient.removeUserAvatar(token, avatar_id);
  }
  static async setUserPrimaryAvatar(token: string, avatar_id: number): Promise<any> {
    return UserApiClient.setUserPrimaryAvatar(token, avatar_id);
  }
}
