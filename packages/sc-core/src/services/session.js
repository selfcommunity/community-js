import http from '../utils/http';
import endpoints from '../constants/Endpoints';

function getCurrentUser() {
  return http
    .request({
      url: endpoints.Me.url(),
      method: endpoints.Me.method
    })
    .then((res) => {
      if (res.status >= 300) {
        return Promise.reject(res);
      }
      const data = res.data.data;
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

function getUser(id) {
  return http
    .request({
      url: endpoints.User.url({id: id}),
      method: endpoints.User.method
    })
    .then((res) => {
      if (res.status >= 300) {
        return Promise.reject(res);
      }
      const data = res.data.data;
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export default {
  getCurrentUser,
  getUser
};
