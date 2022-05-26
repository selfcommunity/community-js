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
  getAllUsers(): Promise<SCPaginatedResponse<SCUserType>>;
  getHiddenUsers(): Promise<SCPaginatedResponse<SCUserType>>;
  userAutocomplete(params: UserAutocompleteParams): Promise<SCPaginatedResponse<SCUserAutocompleteType>>;
  userSearch(params: UserSearchParams): Promise<SCPaginatedResponse<SCUserType>>;
  getSpecificUser(id: number): Promise<SCUserType>;
  getUserCounters(id: number): Promise<SCUserCounterType>;
  userUpdate(id: number, data?: SCUserType): Promise<SCUserType>;
  userPatch(id: number, data?: SCUserType): Promise<SCUserType>;
  userDelete(id: number, hard?: number): Promise<any>;
  changeUserMail(id: number, new_email: string, confirm?: boolean): Promise<any | SCUserChangeEmailType>;
  confirmChangeUserMail(id: number, new_email: string, validation_code?: string): Promise<any>;
  changeUserPassword(id: number, password: string, new_password: string): Promise<any>;
  userSettings(id: number): Promise<SCUserSettingsType>;
  userSettingsPatch(id: number, data?: SCUserSettingsType): Promise<SCUserSettingsType>;
  getCurrentUser(): Promise<SCUserType>;
  getCurrentUserAvatar(): Promise<SCUserAvatarType>;
  getCurrentUserPermission(): Promise<SCUserPermissionType>;
  getCurrentUserPlatform(): Promise<SCPlatformType>;
  getUserFollowedCategories(id: number, mutual?: number): Promise<SCCategoryType[]>;
  getUserFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getUserFollowers(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>>;
  getUserFollowed(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>>;
  followUser(id: number): Promise<any>;
  checkUserFollowed(id: number): Promise<SCUserFollowedStatusType>;
  checkUserFollower(id: number): Promise<SCUserFollowerStatusType>;
  getUserConnections(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>>;
  checkUserConnections(id: number): Promise<SCUserConnectionStatusType>;
  getUserConnectionRequests(id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>>;
  getUserRequestConnectionsSent(id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>>;
  userAcceptRequestConnection(id: number): Promise<any>;
  userRequestConnection(id: number): Promise<any>;
  userRemoveConnection(id: number): Promise<any>;
  userCancelRejectConnectionRequest(id: number): Promise<any>;
  userCancelRequestConnection(id: number): Promise<any>;
  userRejectConnectionRequest(id: number): Promise<any>;
  userMarkSeenConnectionRequest(id: number): Promise<any>;
  showHideUser(id: number): Promise<any>;
  checkUserHidden(id: number): Promise<SCUserHiddenStatusType>;
  checkUserHiddenBy(id: number): Promise<SCUserHiddenByStatusType>;
  getUserLoyaltyPoints(id: number): Promise<SCUserLoyaltyPointsType>;
  getUserConnectionStatuses(users: number[]): Promise<any>;
  userTagToAddressContribution(): Promise<SCTagType>;
  checkUserEmailToken(): Promise<SCUserEmailTokenType>;
  addUserAvatar(avatar: SCMediaType): Promise<SCAvatarType>;
  getUserAvatars(): Promise<SCAvatarType>;
  removeUserAvatar(avatar_id: number): Promise<any>;
  setUserPrimaryAvatar(avatar_id: number): Promise<any>;
}

/**
 * Contains all the endpoints needed to manage users.
 */
export class UserApiClient {
  /**
   * This endpoint retrieves the list of all users
   */
  static getAllUsers(): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.User.url({}), Endpoints.User.method);
  }

  /**
   * This endpoint retrieves the list of all users hidden by the authenticated user
   */
  static getHiddenUsers(): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.ListHiddenUsers.url(), Endpoints.ListHiddenUsers.method);
  }

  /**
   * This endpoint retrieves the list of all users that meet the search criteria. The user object returned will contain only the following attributes: id, username, real_name, ext_id and avatar.
   * This endpoint is recommended for implementing an autocomplete input field.
   * @param params
   */
  static userAutocomplete(params: UserAutocompleteParams): Promise<SCPaginatedResponse<SCUserAutocompleteType>> {
    return apiRequest(`${Endpoints.UserAutocomplete.url()}?${params.toString()})}`, Endpoints.UserAutocomplete.method);
  }

  /**
   * This endpoint performs users search.
   * @param params
   */
  static userSearch(params: UserSearchParams): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(`${Endpoints.UserSearch.url()}?${params.toString()})}`, Endpoints.UserSearch.method);
  }

  /**
   * This endpoint retrieves a specific user's profile identified by ID.
   * @param id
   */
  static getSpecificUser(id: number): Promise<SCUserType> {
    return apiRequest(Endpoints.User.url({id}), Endpoints.User.method);
  }

  /**
   * This endpoint retrieves the counters of a specific user identified by Id.
   * @param id
   */
  static getUserCounters(id: number): Promise<SCUserCounterType> {
    return apiRequest(Endpoints.UserCounters.url({id}), Endpoints.UserCounters.method);
  }

  /**
   * This endpoint updates the profile of a user identified by ID. A user can only update their personal data.
   * @param id
   * @param data
   */
  static userUpdate(id: number, data?: SCUserType): Promise<SCUserType> {
    return apiRequest(Endpoints.UserUpdate.url({id}), Endpoints.UserUpdate.method, data ?? null);
  }

  /**
   * This endpoint patches a specific user identified by {id}
   * @param id
   * @param data
   */
  static userPatch(id: number, data?: SCUserType): Promise<SCUserType> {
    return apiRequest(Endpoints.UserPatch.url({id}), Endpoints.UserPatch.method, data ?? null);
  }

  /**
   * This endpoint deletes a specific user identified by {id}
   * @param id
   * @param hard
   */
  static userDelete(id: number, hard?: number): Promise<any> {
    return apiRequest(`${Endpoints.UserDelete.url({id})}?${hard.toString()})}`, Endpoints.UserDelete.method);
  }

  /**
   * This endpoint changes the email of the authenticated user.
   * @param id
   * @param new_email
   * @param confirm
   */
  static changeUserMail(id: number, new_email: string, confirm?: boolean): Promise<any | SCUserChangeEmailType> {
    return apiRequest(Endpoints.ChangeUserMail.url({id}), Endpoints.ChangeUserMail.method, {new_email: new_email, confirm: confirm ?? null});
  }

  /**
   * This endpoint confirms email change.
   * @param id
   * @param new_email
   * @param validation_code
   */
  static confirmChangeUserMail(id: number, new_email: string, validation_code?: string): Promise<any> {
    return apiRequest(Endpoints.ConfirmUserChangeMail.url({id}), Endpoints.ConfirmUserChangeMail.method, {
      new_email: new_email,
      validation_code: validation_code
    });
  }

  /**
   * This endpoint changes the password of the authenticated user.
   * @param id
   * @param password
   * @param new_password
   */
  static changeUserPassword(id: number, password: string, new_password: string): Promise<any> {
    return apiRequest(Endpoints.ChangeUserPassword.url({id}), Endpoints.ChangeUserPassword.method, {password: password, new_password: new_password});
  }

  /**
   * This endpoint retrieves all current user's settings for the authenticated user.
   * @param id
   */
  static userSettings(id: number): Promise<SCUserSettingsType> {
    return apiRequest(Endpoints.UserSettings.url({id}), Endpoints.UserSettings.method);
  }

  /**
   * This endpoint changes the user settings for the authenticated user.
   * @param id
   * @param data
   */
  static userSettingsPatch(id: number, data?: SCUserSettingsType): Promise<SCUserSettingsType> {
    return apiRequest(Endpoints.UserSettingsPatch.url({id}), Endpoints.UserSettingsPatch.method, data ?? null);
  }

  /**
   * This endpoint returns the user identified by the authentication token.
   */
  static getCurrentUser(): Promise<SCUserType> {
    return apiRequest(Endpoints.Me.url(), Endpoints.Me.method);
  }

  /**
   * This endpoint returns the url to the user's current avatar.
   */
  static getCurrentUserAvatar(): Promise<SCUserAvatarType> {
    return apiRequest(Endpoints.MyAvatar.url({}), Endpoints.MyAvatar.method);
  }

  /**
   * This endpoint returns a list of permissions for the user identified by the authentication token. Some of the permissions in the list depend on global community settings.
   */
  static getCurrentUserPermission(): Promise<SCUserPermissionType> {
    return apiRequest(Endpoints.Permission.url({}), Endpoints.Permission.method);
  }

  /**
   * This endpoint retrieves the platform url starting from the Authorization user token. Using this url, the logged user (must be a staff member) can access the platform to manage the community.
   */
  static getCurrentUserPlatform(): Promise<SCPlatformType> {
    return apiRequest(Endpoints.Platform.url({}), Endpoints.Platform.method);
  }

  /**
   * This endpoint gets the list of categories followed by the user.
   * @param id
   * @param mutual
   */
  static getUserFollowedCategories(id: number, mutual?: number): Promise<SCCategoryType[]> {
    return apiRequest(`${Endpoints.FollowedCategories.url({id})}?${mutual.toString()})}`, Endpoints.FollowedCategories.method);
  }

  /**
   * This endpoint retrieves the list of posts of the user identified by {id}
   * @param id
   */
  static getUserFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.UserFeed.url({id}), Endpoints.UserFeed.method);
  }

  /**
   * This endpoint retrieves the list of followers of a specific user identified by {id}
   * @param id
   * @param mutual
   */
  static getUserFollowers(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(`${Endpoints.UserFollowers.url({id})}?${mutual.toString()})}`, Endpoints.UserFollowers.method);
  }

  /**
   * This endpoint retrieves the list of following of a specific user identified by {id}.
   * @param id
   * @param mutual
   */
  static getUserFollowed(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(`${Endpoints.UserFollowed.url({id})}?${mutual.toString()})`, Endpoints.UserFollowed.method);
  }

  /**
   * This endpoint allows a user to follow another user identified by {id}
   * @param id
   */
  static followUser(id: number): Promise<any> {
    return apiRequest(Endpoints.FollowUser.url({id}), Endpoints.FollowUser.method);
  }

  /**
   * This endpoint returns is_followed = true if the user (identified in path) is followed by me.
   * @param id
   */
  static checkUserFollowed(id: number): Promise<SCUserFollowedStatusType> {
    return apiRequest(Endpoints.CheckUserFollowed.url({id}), Endpoints.CheckUserFollowed.method);
  }

  /**
   * This endpoint returns is_follower = true if the user (identified in path) follow me
   * @param id
   */
  static checkUserFollower(id: number): Promise<SCUserFollowerStatusType> {
    return apiRequest(Endpoints.CheckUserFollower.url({id}), Endpoints.CheckUserFollower.method);
  }

  /**
   * This endpoint retrieves the list of connections of a specific user identified by ID.
   * @param id
   * @param mutual
   */
  static getUserConnections(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(`${Endpoints.UserConnections.url({id})}?${mutual.toString()})`, Endpoints.UserConnections.method);
  }

  /**
   * This endpoint returns is_connection = true if the user (identified in path) is connected with me.
   * @param id
   */
  static checkUserConnections(id: number): Promise<SCUserConnectionStatusType> {
    return apiRequest(Endpoints.UserCheckConnection.url({id}), Endpoints.UserCheckConnection.method);
  }

  /**
   * This endpoint retrieves the list of connection requests received by a specific user identified by ID.
   * @param id
   */
  static getUserConnectionRequests(id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return apiRequest(Endpoints.UserConnectionRequests.url({id}), Endpoints.UserConnectionRequests.method);
  }

  /**
   * This endpoint retrieves a specific user's list of connection requests sent by user.
   * @param id
   */
  static getUserRequestConnectionsSent(id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return apiRequest(Endpoints.UserRequestConnectionsSent.url({id}), Endpoints.UserRequestConnectionsSent.method);
  }

  /**
   * This endpoint accepts a request connection of the user identified by {id}
   * @param id
   */
  static userAcceptRequestConnection(id: number): Promise<any> {
    return apiRequest(Endpoints.UserAcceptRequestConnection.url({id}), Endpoints.UserAcceptRequestConnection.method);
  }

  /**
   * This endpoint requests a connection to the user identified by {id}
   * @param id
   */
  static userRequestConnection(id: number): Promise<any> {
    return apiRequest(Endpoints.UserRequestConnection.url({id}), Endpoints.UserRequestConnection.method);
  }

  /**
   * This endpoint removes connection with the user identified by {id}
   * @param id
   */
  static userRemoveConnection(id: number): Promise<any> {
    return apiRequest(Endpoints.UserRemoveConnection.url({id}), Endpoints.UserRemoveConnection.method);
  }

  /**
   * This endpoint cancels reject connection to a user identified by {id}
   * @param id
   */
  static userCancelRejectConnectionRequest(id: number): Promise<any> {
    return apiRequest(Endpoints.UserCancelRejectConnectionRequest.url({id}), Endpoints.UserCancelRejectConnectionRequest.method);
  }

  /**
   * This endpoint cancels a request connection for a user.
   * @param id
   */
  static userCancelRequestConnection(id: number): Promise<any> {
    return apiRequest(Endpoints.UserCancelRequestConnection.url({id}), Endpoints.UserCancelRequestConnection.method);
  }

  /**
   * This endpoint rejects a connection request sent from user identified by {id}
   * @param id
   */
  static userRejectConnectionRequest(id: number): Promise<any> {
    return apiRequest(Endpoints.UserRejectConnectionRequest.url({id}), Endpoints.UserRejectConnectionRequest.method);
  }

  /**
   * This endpoint marks seen a connection request of user identified by {id} for the authenticated user.
   * @param id
   */
  static userMarkSeenConnectionRequest(id: number): Promise<any> {
    return apiRequest(Endpoints.UserMarkSeenConnectionRequest.url({id}), Endpoints.UserMarkSeenConnectionRequest.method);
  }

  /**
   * This endpoint shows/hides a user (and its posts) identified by {id} for the authenticated user.
   * @param id
   */
  static showHideUser(id: number): Promise<any> {
    return apiRequest(Endpoints.UserShowHide.url({id}), Endpoints.UserShowHide.method);
  }

  /**
   * This endpoint returns true if the user (identified in path) is hidden by the authenticated user.
   * @param id
   */
  static checkUserHidden(id: number): Promise<SCUserHiddenStatusType> {
    return apiRequest(Endpoints.CheckUserHidden.url({id}), Endpoints.CheckUserHidden.method);
  }

  /**
   * This endpoint returns true if the user (identified in path) has hidden by the authenticated user.
   * @param id
   */
  static checkUserHiddenBy(id: number): Promise<SCUserHiddenByStatusType> {
    return apiRequest(Endpoints.CheckUserHiddenBy.url({id}), Endpoints.CheckUserHiddenBy.method);
  }

  /**
   * This endpoint returns user's loyalty points.
   * @param id
   */
  static getUserLoyaltyPoints(id: number): Promise<SCUserLoyaltyPointsType> {
    return apiRequest(Endpoints.GetUserLoyaltyPoints.url({id}), Endpoints.GetUserLoyaltyPoints.method);
  }

  /**
   * This endpoint lists the connection/follow statuses of the logged user starting from a users array.
   * @param users
   */
  static getUserConnectionStatuses(users: number[]): Promise<any> {
    return apiRequest(Endpoints.UserConnectionStatuses.url({}), Endpoints.UserConnectionStatuses.method, {users: users});
  }

  /**
   * This endpoint returns user's tags to address a contribution.
   */
  static userTagToAddressContribution(): Promise<SCTagType> {
    return apiRequest(Endpoints.UserTagToAddressContribution.url({}), Endpoints.UserTagToAddressContribution.method);
  }

  /**
   * This endpoint checks an email token.
   */
  static checkUserEmailToken(): Promise<SCUserEmailTokenType> {
    return apiRequest(Endpoints.CheckEmailToken.url({}), Endpoints.CheckEmailToken.method);
  }

  /**
   * This endpoint adds an avatar to my avatars.
   * @param avatar
   */
  static addUserAvatar(avatar: SCMediaType): Promise<SCAvatarType> {
    return apiRequest(Endpoints.AddAvatar.url({}), Endpoints.AddAvatar.method, {'Content-Type': 'multipart/form-data'}, {avatar: avatar});
  }

  /**
   * This endpoint retrieves all user avatars.
   */
  static getUserAvatars(): Promise<SCAvatarType> {
    return apiRequest(Endpoints.GetAvatars.url({}), Endpoints.GetAvatars.method);
  }

  /**
   * This endpoint removes/deletes an avatar from the authenticated user avatars.
   * @param avatar_id
   */
  static removeUserAvatar(avatar_id: number): Promise<any> {
    return apiRequest(Endpoints.RemoveAvatar.url({}), Endpoints.RemoveAvatar.method, {avatar_id: avatar_id});
  }

  /**
   * This endpoint sets the primary avatar for the authenticated user.
   * @param avatar_id
   */
  static setUserPrimaryAvatar(avatar_id: number): Promise<any> {
    return apiRequest(Endpoints.SetPrimaryAvatar.url({}), Endpoints.SetPrimaryAvatar.method, {avatar_id: avatar_id});
  }
}

export default class UserService {
  static async getAllUsers(): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getAllUsers();
  }
  static async getHiddenUsers(): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getHiddenUsers();
  }
  static async userAutocomplete(params: UserAutocompleteParams): Promise<SCPaginatedResponse<SCUserAutocompleteType>> {
    return UserApiClient.userAutocomplete(params);
  }
  static async userSearch(params: UserSearchParams): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.userSearch(params);
  }
  static async getSpecificUser(id: number): Promise<SCUserType> {
    return UserApiClient.getSpecificUser(id);
  }
  static async getUserCounters(id: number): Promise<SCUserCounterType> {
    return UserApiClient.getUserCounters(id);
  }
  static async userUpdate(id: number, data?: SCUserType): Promise<SCUserType> {
    return UserApiClient.userUpdate(id, data);
  }
  static async userPatch(id: number, data?: SCUserType): Promise<SCUserType> {
    return UserApiClient.userPatch(id, data);
  }
  static async userDelete(id: number, hard?: number): Promise<any> {
    return UserApiClient.userDelete(id, hard);
  }
  static async changeUserMail(id: number, new_email: string, confirm?: boolean): Promise<any | SCUserChangeEmailType> {
    return UserApiClient.changeUserMail(id, new_email, confirm);
  }
  static async confirmChangeUserMail(id: number, new_email: string, validation_code?: string): Promise<any> {
    return UserApiClient.confirmChangeUserMail(id, new_email, validation_code);
  }
  static async changeUserPassword(id: number, password: string, new_password: string): Promise<any> {
    return UserApiClient.changeUserPassword(id, password, new_password);
  }
  static async userSettings(id: number): Promise<SCUserSettingsType> {
    return UserApiClient.userSettings(id);
  }
  static async userSettingsPatch(id: number, data?: SCUserSettingsType): Promise<SCUserSettingsType> {
    return UserApiClient.userSettingsPatch(id, data);
  }
  static async getCurrentUser(): Promise<SCUserType> {
    return UserApiClient.getCurrentUser();
  }
  static async getCurrentUserAvatar(): Promise<SCUserAvatarType> {
    return UserApiClient.getCurrentUserAvatar();
  }
  static async getCurrentUserPermission(): Promise<SCUserPermissionType> {
    return UserApiClient.getCurrentUserPermission();
  }
  static async getCurrentUserPlatform(): Promise<SCPlatformType> {
    return UserApiClient.getCurrentUserPlatform();
  }
  static async getUserFollowedCategories(id: number, mutual?: number): Promise<SCCategoryType[]> {
    return UserApiClient.getUserFollowedCategories(id, mutual);
  }
  static async getUserFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return UserApiClient.getUserFeed(id);
  }
  static async getUserFollowers(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserFollowers(id, mutual);
  }
  static async getUserFollowed(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserFollowed(id, mutual);
  }
  static async followUser(id: number): Promise<any> {
    return UserApiClient.followUser(id);
  }
  static async checkUserFollowed(id: number): Promise<SCUserFollowedStatusType> {
    return UserApiClient.checkUserFollowed(id);
  }
  static async checkUserFollower(id: number): Promise<SCUserFollowerStatusType> {
    return UserApiClient.checkUserFollower(id);
  }
  static async getUserConnections(id: number, mutual?: number): Promise<SCPaginatedResponse<SCUserType>> {
    return UserApiClient.getUserConnections(id, mutual);
  }
  static async checkUserConnections(id: number): Promise<SCUserConnectionStatusType> {
    return UserApiClient.checkUserConnections(id);
  }
  static async getUserConnectionRequests(id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return UserApiClient.getUserConnectionRequests(id);
  }
  static async getUserRequestConnectionsSent(id: number): Promise<SCPaginatedResponse<SCUserConnectionRequestType>> {
    return UserApiClient.getUserRequestConnectionsSent(id);
  }
  static async userAcceptRequestConnection(id: number): Promise<any> {
    return UserApiClient.userAcceptRequestConnection(id);
  }
  static async userRequestConnection(id: number): Promise<any> {
    return UserApiClient.userRequestConnection(id);
  }
  static async userRemoveConnection(id: number): Promise<any> {
    return UserApiClient.userRemoveConnection(id);
  }
  static async userCancelRejectConnectionRequest(id: number): Promise<any> {
    return UserApiClient.userCancelRejectConnectionRequest(id);
  }
  static async userCancelRequestConnection(id: number): Promise<any> {
    return UserApiClient.userCancelRequestConnection(id);
  }
  static async userRejectConnectionRequest(id: number): Promise<any> {
    return UserApiClient.userRejectConnectionRequest(id);
  }
  static async userMarkSeenConnectionRequest(id: number): Promise<any> {
    return UserApiClient.userMarkSeenConnectionRequest(id);
  }
  static async showHideUser(id: number): Promise<any> {
    return UserApiClient.showHideUser(id);
  }
  static async checkUserHidden(id: number): Promise<SCUserHiddenStatusType> {
    return UserApiClient.checkUserHidden(id);
  }
  static async checkUserHiddenBy(id: number): Promise<SCUserHiddenByStatusType> {
    return UserApiClient.checkUserHiddenBy(id);
  }
  static async getUserLoyaltyPoints(id: number): Promise<SCUserLoyaltyPointsType> {
    return UserApiClient.getUserLoyaltyPoints(id);
  }
  static async getUserConnectionStatuses(users: number[]): Promise<any> {
    return UserApiClient.getUserConnectionStatuses(users);
  }
  static async userTagToAddressContribution(): Promise<SCTagType> {
    return UserApiClient.userTagToAddressContribution();
  }
  static async checkUserEmailToken(): Promise<SCUserEmailTokenType> {
    return UserApiClient.checkUserEmailToken();
  }
  static async addUserAvatar(avatar: SCMediaType): Promise<SCAvatarType> {
    return UserApiClient.addUserAvatar(avatar);
  }
  static async getUserAvatars(): Promise<SCAvatarType> {
    return UserApiClient.getUserAvatars();
  }
  static async removeUserAvatar(avatar_id: number): Promise<any> {
    return UserApiClient.removeUserAvatar(avatar_id);
  }
  static async setUserPrimaryAvatar(avatar_id: number): Promise<any> {
    return UserApiClient.setUserPrimaryAvatar(avatar_id);
  }
}
