import http from '../utils/http';
import endpoints from '../constants/Endpoints';
import {Logger} from '../utils/logger';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * Load community features
 * @returns {Promise<T>}
 */
function loadFeatures() {
  return http
    .request({
      url: endpoints.Feature.url(),
      method: endpoints.Feature.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        Logger.error(SCOPE_SC_CORE, `Unable to retrieve community preferences (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      const data = res.data.results.map((f) => f.name);
      return Promise.resolve(data);
    })
    .catch((error) => {
      Logger.error(SCOPE_SC_CORE, 'Unable to retrieve community preferences.');
      return Promise.reject(error);
    });
}

export default {
  loadFeatures,
};
