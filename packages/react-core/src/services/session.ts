import {http, Endpoints} from '@selfcommunity/api-services';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * Get current authenticated user
 */
function getCurrentUser() {
  return http
    .request({
      url: Endpoints.Me.url(),
      method: Endpoints.Me.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        Logger.error(SCOPE_SC_CORE, `Unable to retrieve user (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      Logger.error(SCOPE_SC_CORE, 'Unable to retrieve user profile.');
      return Promise.reject(error);
    });
}

/**
 * Get user by id
 * @param id
 */
function getUser(id) {
  return http
    .request({
      url: Endpoints.User.url({id: id}),
      method: Endpoints.User.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        Logger.error(SCOPE_SC_CORE, `Unable to retrieve user by id (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      Logger.error(SCOPE_SC_CORE, 'Unable to retrieve user by id.');
      return Promise.reject(error);
    });
}

/**
 * Get user unseen notifications counter
 */
function getUnseenNotificationsCounter() {
  return http
    .request({
      url: Endpoints.UserUnseenNotificationCount.url(),
      method: Endpoints.UserUnseenNotificationCount.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        Logger.error(SCOPE_SC_CORE, `Unable to retrieve unseen notifications counter (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      Logger.error(SCOPE_SC_CORE, 'Unable to retrieve unseen notifications counter.');
      return Promise.reject(error);
    });
}

/**
 * Get broadcast messages unseen counter
 */
function getUnseenBroadcastMessagesCounter() {
  return http
    .request({
      url: Endpoints.BroadcastMessagesUnseenCount.url(),
      method: Endpoints.BroadcastMessagesUnseenCount.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        Logger.error(SCOPE_SC_CORE, `Unable to retrieve unseen broadcast messages counter (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      Logger.error(SCOPE_SC_CORE, 'Unable to retrieve unseen broadcast messages counter.');
      return Promise.reject(error);
    });
}

export default {
  getCurrentUser,
  getUser,
  getUnseenNotificationsCounter,
  getUnseenBroadcastMessagesCounter,
};
