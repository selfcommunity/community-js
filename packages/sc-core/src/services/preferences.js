import http from '../utils/http';
import endpoints from '../constants/Endpoints';

function loadPreferences() {
  return http
    .request({
      url: endpoints.Preferences.url(),
      method: endpoints.Preferences.method,
    })
    .then((res) => {
      if (res.status >= 300) {
        return Promise.reject(res);
      }
      const data = res.data.results.reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
      console.log(data);
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export default {
  loadPreferences,
};
