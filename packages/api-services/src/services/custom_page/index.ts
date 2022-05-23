import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface CustomPageApiClientInterface {
  getASpecificCustomPage(id: number): Promise<any>;
  getAllCustomPages(): Promise<any>;
  searchCustomPages(): Promise<any>;
}

export class CustomPageApiClient {
  static getASpecificCustomPage(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CustomPage.url({id}),
        method: Endpoints.CustomPage.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve custom page (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve custom page.');
        return Promise.reject(error);
      });
  }
  static getAllCustomPages(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetCustomPages.url({}),
        method: Endpoints.GetCustomPages.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve custom pages (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve custom pages.');
        return Promise.reject(error);
      });
  }
  static searchCustomPages(): Promise<any> {
    return client
      .request({
        url: Endpoints.CustomPageSearch.url({}),
        method: Endpoints.CustomPageSearch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve custom pages (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve custom pages.');
        return Promise.reject(error);
      });
  }
}

export default class CustomPageService {
  static async getASpecificCustomPage(id: number): Promise<any> {
    return CustomPageApiClient.getASpecificCustomPage(id);
  }
  static async getAllCustomPages(): Promise<any> {
    return CustomPageApiClient.getAllCustomPages();
  }
  static async searchCustomPages(): Promise<any> {
    return CustomPageApiClient.searchCustomPages();
  }
}
