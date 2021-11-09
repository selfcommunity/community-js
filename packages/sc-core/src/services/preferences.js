import http from '../utils/http';
import endpoints from '../constants/Endpoints';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * Load community preferences
 * @returns {Promise<T>}
 */
function loadPreferences() {
  return http
    .request({
      url: endpoints.Preferences.url(),
      method: endpoints.Preferences.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        Logger.error(SCOPE_SC_CORE, `Unable to retrieve community preferences (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      const data = res.data.results.reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
      return Promise.resolve(data);
    })
    .catch((error) => {
      Logger.error(SCOPE_SC_CORE, 'Unable to retrieve community preferences.');
      return Promise.reject(error);
    });
}

export default {
  loadPreferences,
};
