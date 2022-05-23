import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface LocalityApiClientInterface {
  getLocalities(): Promise<any>;
  searchLocalities(): Promise<any>;
}

export class LocalityApiClient {
  static getLocalities(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetLocalities.url({}),
        method: Endpoints.GetLocalities.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve localities (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve localities.');
        return Promise.reject(error);
      });
  }

  static searchLocalities(): Promise<any> {
    return client
      .request({
        url: Endpoints.ComposerLocalitySearch.url({}),
        method: Endpoints.ComposerLocalitySearch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve localities (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve localities.');
        return Promise.reject(error);
      });
  }
}

export default class LocalityService {
  static async getLocalities(): Promise<any> {
    return LocalityApiClient.getLocalities();
  }
  static async searchLocalities(): Promise<any> {
    return LocalityApiClient.searchLocalities();
  }
}
