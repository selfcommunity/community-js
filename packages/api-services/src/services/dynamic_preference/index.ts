import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface DynamicPreferenceApiClientInterface {
  getASpecificDynamicPreference(id: number): Promise<any>;
  getAllDynamicPreferences(): Promise<any>;
  searchDynamicPreference(): Promise<any>;
}

export class DynamicPreferenceApiClient {
  static getASpecificDynamicPreference(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.SpecificPreference.url({id}),
        method: Endpoints.SpecificPreference.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve preference (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve preference.');
        return Promise.reject(error);
      });
  }
  static getAllDynamicPreferences(): Promise<any> {
    return client
      .request({
        url: Endpoints.Preferences.url({}),
        method: Endpoints.Preferences.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve preferences (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve preferences.');
        return Promise.reject(error);
      });
  }
  static searchDynamicPreference(): Promise<any> {
    return client
      .request({
        url: Endpoints.PreferenceSearch.url({}),
        method: Endpoints.PreferenceSearch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve preferences (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve preferences.');
        return Promise.reject(error);
      });
  }
}

export default class DynamicPreferenceService {
  static async getASpecificDynamicPreference(id: number): Promise<any> {
    return DynamicPreferenceApiClient.getASpecificDynamicPreference(id);
  }
  static async getAllDynamicPreferences(): Promise<any> {
    return DynamicPreferenceApiClient.getAllDynamicPreferences();
  }
  static async searchDynamicPreference(): Promise<any> {
    return DynamicPreferenceApiClient.searchDynamicPreference();
  }
}
