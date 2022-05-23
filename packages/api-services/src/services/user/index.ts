import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface UserApiClientInterface {
  getAllUsers(): Promise<any>;
  getHiddenUsers(): Promise<any>;
  userAutocomplete(): Promise<any>;
  userSearch(): Promise<any>;
  getSpecificUser(id: number): Promise<any>;
  getUserCounters(id: number): Promise<any>;
  userUpdate(id: number): Promise<any>;
  userPatch(id: number): Promise<any>;
  userDelete(id: number): Promise<any>;
  changeUserMail(id: number): Promise<any>;
  confirmChangeUserMail(id: number): Promise<any>;
  changeUserPassword(id: number): Promise<any>;
  userSettings(id: number): Promise<any>;
  userSettingsPatch(id: number): Promise<any>;
  getCurrentUser(): Promise<any>;
  getCurrentUserAvatar(): Promise<any>;
  getCurrentUserPermission(): Promise<any>;
  getCurrentUserPlatform(): Promise<any>;
  getUserFollowedCategories(id: number): Promise<any>;
  getUserFeed(id: number): Promise<any>;
  getUserFollowers(id: number): Promise<any>;
  getUserFollowed(id: number): Promise<any>;
  followUser(id: number): Promise<any>;
  checkUserFollowed(id: number): Promise<any>;
  checkUserFollower(id: number): Promise<any>;
  getUserConnections(id: number): Promise<any>;
  checkUserConnections(id: number): Promise<any>;
  getUserConnectionRequests(id: number): Promise<any>;
  getUserRequestConnectionsSent(id: number): Promise<any>;
  userAcceptRequestConnection(id: number): Promise<any>;
  userRequestConnection(id: number): Promise<any>;
  userRemoveConnection(id: number): Promise<any>;
  userCancelRejectConnectionRequest(id: number): Promise<any>;
  userCancelRequestConnection(id: number): Promise<any>;
  userRejectConnectionRequest(id: number): Promise<any>;
  userMarkSeenConnectionRequest(id: number): Promise<any>;
  showHideUser(id: number): Promise<any>;
  checkUserHidden(id: number): Promise<any>;
  checkUserHiddenBy(id: number): Promise<any>;
  getUserLoyaltyPoints(id: number): Promise<any>;
  getUserConnectionStatuses(): Promise<any>;
  userTagToAddressContribution(): Promise<any>;
  checkUserEmailToken(): Promise<any>;
  addUserAvatar(): Promise<any>;
  getUserAvatars(): Promise<any>;
  removeUserAvatar(): Promise<any>;
  setUserPrimaryAvatar(): Promise<any>;
}

export class UserApiClient {
  static getAllUsers(): Promise<any> {
    return client
      .request({
        url: Endpoints.User.url({}),
        method: Endpoints.User.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve users.');
        return Promise.reject(error);
      });
  }

  static getHiddenUsers(): Promise<any> {
    return client
      .request({
        url: Endpoints.ListHiddenUsers.url(),
        method: Endpoints.ListHiddenUsers.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve hidden users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve hidden users.');
        return Promise.reject(error);
      });
  }

  static userAutocomplete(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserAutocomplete.url(),
        method: Endpoints.UserAutocomplete.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve users.');
        return Promise.reject(error);
      });
  }

  static userSearch(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserSearch.url(),
        method: Endpoints.UserSearch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve users .');
        return Promise.reject(error);
      });
  }

  static getSpecificUser(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.User.url({id}),
        method: Endpoints.User.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve user.');
        return Promise.reject(error);
      });
  }

  static getUserCounters(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserCounters.url({id}),
        method: Endpoints.UserCounters.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve counters (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve counters.');
        return Promise.reject(error);
      });
  }

  static userUpdate(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserUpdate.url({id}),
        method: Endpoints.UserUpdate.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userPatch(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserPatch.url({id}),
        method: Endpoints.UserPatch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userDelete(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserDelete.url({id}),
        method: Endpoints.UserDelete.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static changeUserMail(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.ChangeUserMail.url({id}),
        method: Endpoints.ChangeUserMail.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static confirmChangeUserMail(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.ConfirmUserChangeMail.url({id}),
        method: Endpoints.ConfirmUserChangeMail.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static changeUserPassword(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.ChangeUserPassword.url({id}),
        method: Endpoints.ChangeUserPassword.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userSettings(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserSettings.url({id}),
        method: Endpoints.UserSettings.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userSettingsPatch(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserSettingsPatch.url({id}),
        method: Endpoints.UserSettingsPatch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getCurrentUser(): Promise<any> {
    return client
      .request({
        url: Endpoints.Me.url(),
        method: Endpoints.Me.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user profile.');
        return Promise.reject(error);
      });
  }

  static getCurrentUserAvatar(): Promise<any> {
    return client
      .request({
        url: Endpoints.MyAvatar.url({}),
        method: Endpoints.MyAvatar.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user avatar (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user avatar.');
        return Promise.reject(error);
      });
  }

  static getCurrentUserPermission(): Promise<any> {
    return client
      .request({
        url: Endpoints.Permission.url({}),
        method: Endpoints.Permission.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user permissions (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user permissions.');
        return Promise.reject(error);
      });
  }

  static getCurrentUserPlatform(): Promise<any> {
    return client
      .request({
        url: Endpoints.Platform.url({}),
        method: Endpoints.Platform.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve platform (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve platform.');
        return Promise.reject(error);
      });
  }

  static getUserFollowedCategories(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FollowedCategories.url({id}),
        method: Endpoints.FollowedCategories.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve categories followed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve categories followed.');
        return Promise.reject(error);
      });
  }

  static getUserFeed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserFeed.url({id}),
        method: Endpoints.UserFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user feed.');
        return Promise.reject(error);
      });
  }

  static getUserFollowers(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserFollowers.url({id}),
        method: Endpoints.UserFollowers.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user followers (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user followers.');
        return Promise.reject(error);
      });
  }

  static getUserFollowed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserFollowed.url({id}),
        method: Endpoints.UserFollowed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user followings (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user followings.');
        return Promise.reject(error);
      });
  }

  static followUser(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FollowUser.url({id}),
        method: Endpoints.FollowUser.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static checkUserFollowed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckUserFollowed.url({id}),
        method: Endpoints.CheckUserFollowed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve users .');
        return Promise.reject(error);
      });
  }

  static checkUserFollower(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckUserFollower.url({id}),
        method: Endpoints.CheckUserFollower.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve users .');
        return Promise.reject(error);
      });
  }

  static getUserConnections(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserConnections.url({id}),
        method: Endpoints.UserConnections.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user connections (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user connections.');
        return Promise.reject(error);
      });
  }

  static checkUserConnections(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserCheckConnection.url({id}),
        method: Endpoints.UserCheckConnection.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getUserConnectionRequests(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserConnectionRequests.url({id}),
        method: Endpoints.UserConnectionRequests.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user connection requests (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user connection requests.');
        return Promise.reject(error);
      });
  }

  static getUserRequestConnectionsSent(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserRequestConnectionsSent.url({id}),
        method: Endpoints.UserRequestConnectionsSent.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user connection requests sent (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user connection requests sent.');
        return Promise.reject(error);
      });
  }

  static userAcceptRequestConnection(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserAcceptRequestConnection.url({id}),
        method: Endpoints.UserAcceptRequestConnection.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userRequestConnection(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserRequestConnection.url({id}),
        method: Endpoints.UserRequestConnection.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userRemoveConnection(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserRemoveConnection.url({id}),
        method: Endpoints.UserRemoveConnection.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userCancelRejectConnectionRequest(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserCancelRejectConnectionRequest.url({id}),
        method: Endpoints.UserCancelRejectConnectionRequest.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userCancelRequestConnection(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserCancelRequestConnection.url({id}),
        method: Endpoints.UserCancelRequestConnection.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userRejectConnectionRequest(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserRejectConnectionRequest.url({id}),
        method: Endpoints.UserRejectConnectionRequest.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static userMarkSeenConnectionRequest(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserMarkSeenConnectionRequest.url({id}),
        method: Endpoints.UserMarkSeenConnectionRequest.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static showHideUser(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserShowHide.url({id}),
        method: Endpoints.UserShowHide.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static checkUserHidden(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckUserHidden.url({id}),
        method: Endpoints.CheckUserHidden.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static checkUserHiddenBy(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckUserHiddenBy.url({id}),
        method: Endpoints.CheckUserHiddenBy.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getUserLoyaltyPoints(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetUserLoyaltyPoints.url({id}),
        method: Endpoints.GetUserLoyaltyPoints.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user loyalty points (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user loyalty points.');
        return Promise.reject(error);
      });
  }

  static getUserConnectionStatuses(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserConnectionStatuses.url({}),
        method: Endpoints.UserConnectionStatuses.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user connection statuses (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user connection statuses.');
        return Promise.reject(error);
      });
  }

  static userTagToAddressContribution(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserTagToAddressContribution.url({}),
        method: Endpoints.UserTagToAddressContribution.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static checkUserEmailToken(): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckEmailToken.url({}),
        method: Endpoints.CheckEmailToken.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static addUserAvatar(): Promise<any> {
    return client
      .request({
        url: Endpoints.AddAvatar.url({}),
        method: Endpoints.AddAvatar.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getUserAvatars(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetAvatars.url({}),
        method: Endpoints.GetAvatars.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user avatars (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user avatars.');
        return Promise.reject(error);
      });
  }

  static removeUserAvatar(): Promise<any> {
    return client
      .request({
        url: Endpoints.RemoveAvatar.url({}),
        method: Endpoints.RemoveAvatar.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static setUserPrimaryAvatar(): Promise<any> {
    return client
      .request({
        url: Endpoints.SetPrimaryAvatar.url({}),
        method: Endpoints.SetPrimaryAvatar.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
}

export default class UserService {
  static async getAllUsers(): Promise<any> {
    return UserApiClient.getAllUsers();
  }
  static async getHiddenUsers(): Promise<any> {
    return UserApiClient.getHiddenUsers();
  }
  static async userAutocomplete(): Promise<any> {
    return UserApiClient.userAutocomplete();
  }
  static async userSearch(): Promise<any> {
    return UserApiClient.userSearch();
  }
  static async getSpecificUser(id: number): Promise<any> {
    return UserApiClient.getSpecificUser(id);
  }
  static async getUserCounters(id: number): Promise<any> {
    return UserApiClient.getUserCounters(id);
  }
  static async userUpdate(id: number): Promise<any> {
    return UserApiClient.userUpdate(id);
  }
  static async userPatch(id: number): Promise<any> {
    return UserApiClient.userPatch(id);
  }
  static async userDelete(id: number): Promise<any> {
    return UserApiClient.userDelete(id);
  }
  static async changeUserMail(id: number): Promise<any> {
    return UserApiClient.changeUserMail(id);
  }
  static async confirmChangeUserMail(id: number): Promise<any> {
    return UserApiClient.confirmChangeUserMail(id);
  }
  static async changeUserPassword(id: number): Promise<any> {
    return UserApiClient.changeUserPassword(id);
  }
  static async userSettings(id: number): Promise<any> {
    return UserApiClient.userSettings(id);
  }
  static async userSettingsPatch(id: number): Promise<any> {
    return UserApiClient.userSettingsPatch(id);
  }
  static async getCurrentUser(): Promise<any> {
    return UserApiClient.getCurrentUser();
  }
  static async getCurrentUserAvatar(): Promise<any> {
    return UserApiClient.getCurrentUserAvatar();
  }
  static async getCurrentUserPermission(): Promise<any> {
    return UserApiClient.getCurrentUserPermission();
  }
  static async getCurrentUserPlatform(): Promise<any> {
    return UserApiClient.getCurrentUserPlatform();
  }
  static async getUserFollowedCategories(id: number): Promise<any> {
    return UserApiClient.getUserFollowedCategories(id);
  }
  static async getUserFeed(id: number): Promise<any> {
    return UserApiClient.getUserFeed(id);
  }
  static async getUserFollowers(id: number): Promise<any> {
    return UserApiClient.getUserFollowers(id);
  }
  static async getUserFollowed(id: number): Promise<any> {
    return UserApiClient.getUserFollowed(id);
  }
  static async followUser(id: number): Promise<any> {
    return UserApiClient.followUser(id);
  }
  static async checkUserFollowed(id: number): Promise<any> {
    return UserApiClient.checkUserFollowed(id);
  }
  static async checkUserFollower(id: number): Promise<any> {
    return UserApiClient.checkUserFollower(id);
  }
  static async getUserConnections(id: number): Promise<any> {
    return UserApiClient.getUserConnections(id);
  }
  static async checkUserConnections(id: number): Promise<any> {
    return UserApiClient.checkUserConnections(id);
  }
  static async getUserConnectionRequests(id: number): Promise<any> {
    return UserApiClient.getUserConnectionRequests(id);
  }
  static async getUserRequestConnectionsSent(id: number): Promise<any> {
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
  static async checkUserHidden(id: number): Promise<any> {
    return UserApiClient.checkUserHidden(id);
  }
  static async checkUserHiddenBy(id: number): Promise<any> {
    return UserApiClient.checkUserHiddenBy(id);
  }
  static async getUserLoyaltyPoints(id: number): Promise<any> {
    return UserApiClient.getUserLoyaltyPoints(id);
  }
  static async getUserConnectionStatuses(): Promise<any> {
    return UserApiClient.getUserConnectionStatuses();
  }
  static async userTagToAddressContribution(): Promise<any> {
    return UserApiClient.userTagToAddressContribution();
  }
  static async checkUserEmailToken(): Promise<any> {
    return UserApiClient.checkUserEmailToken();
  }
  static async addUserAvatar(): Promise<any> {
    return UserApiClient.addUserAvatar();
  }
  static async getUserAvatars(): Promise<any> {
    return UserApiClient.getUserAvatars();
  }
  static async removeUserAvatar(): Promise<any> {
    return UserApiClient.removeUserAvatar();
  }
  static async setUserPrimaryAvatar(): Promise<any> {
    return UserApiClient.setUserPrimaryAvatar();
  }
}
