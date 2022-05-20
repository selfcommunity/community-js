import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface SuggestionApiClientInterface {
  getCategorySuggestion(): Promise<any>;
  getIncubatorSuggestion(): Promise<any>;
  getPollSuggestion(): Promise<any>;
  getUserSuggestion(): Promise<any>;
}

export class SuggestionApiClient {
  static getCategorySuggestion(): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoriesSuggestion.url({}),
        method: Endpoints.CategoriesSuggestion.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve categories (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve categories.');
        return Promise.reject(error);
      });
  }

  static getIncubatorSuggestion(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetIncubatorSuggestion.url({}),
        method: Endpoints.GetIncubatorSuggestion.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve incubators (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve incubators.');
        return Promise.reject(error);
      });
  }

  static getPollSuggestion(): Promise<any> {
    return client
      .request({
        url: Endpoints.PollSuggestion.url({}),
        method: Endpoints.PollSuggestion.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve polls (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve polls.');
        return Promise.reject(error);
      });
  }

  static getUserSuggestion(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserSuggestion.url({}),
        method: Endpoints.UserSuggestion.method
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
}

export default class SuggestionService {
  static async getCategorySuggestion(): Promise<any> {
    return SuggestionApiClient.getCategorySuggestion();
  }

  static async getIncubatorSuggestion(): Promise<any> {
    return SuggestionApiClient.getIncubatorSuggestion();
  }

  static async getPollSuggestion(): Promise<any> {
    return SuggestionApiClient.getPollSuggestion();
  }

  static async getUserSuggestion(): Promise<any> {
    return SuggestionApiClient.getUserSuggestion();
  }
}
