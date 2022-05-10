import client from '../../apiClient';
import Endpoints from '../../constants/Endpoints';

export interface PreferenceApiClientInterface {
  getAllPreferences(): Promise<any>;
  searchPreferences(search?: string, section?: string, keys?: string, ordering?: string): Promise<any>;
  getSpecificPreference(id: number): Promise<any>;
}

export class PreferenceApiClient {
  static getAllPreferences(): Promise<any> {
    return client
      .request({
        url: Endpoints.Preferences.url({}),
        method: Endpoints.Preferences.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve community preferences (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        const data = res.data['results'].reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
        return Promise.resolve(data);
      })
      .catch((error) => {
        console.log('Unable to retrieve community preferences.');
        return Promise.reject(error);
      });
  }

  static searchPreferences(search?: string, section?: string, keys?: string, ordering?: string): Promise<any> {
    const params = new URLSearchParams({
      ...(search && {search: search}),
      ...(section && {section: section}),
      ...(keys && {keys: keys}),
      ...(ordering && {ordering: ordering})
    });
    return client
      .request({
        url: `${Endpoints.Preferences.url({})}?${params.toString()}`,
        method: Endpoints.Preferences.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve community preferences (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        const data = res.data['results'].reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve community preferences.');
        return Promise.reject(error);
      });
  }

  static getSpecificPreference(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Preferences.url({id}),
        method: Endpoints.Preferences.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve community preference (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve community preference.');
        return Promise.reject(error);
      });
  }
}

export default class PreferenceService {
  static async getAllPreferences(): Promise<any> {
    return PreferenceApiClient.getAllPreferences();
  }

  static async searchPreferences(search?: string, section?: string, keys?: string, ordering?: string): Promise<any> {
    return PreferenceApiClient.searchPreferences(search, section, keys, ordering);
  }

  static async getSpecificPreference(id: number): Promise<any> {
    return PreferenceApiClient.getSpecificPreference(id);
  }
}
