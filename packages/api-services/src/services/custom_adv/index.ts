import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface CustomAdvApiClientInterface {
  getASpecificCustomAdv(id: number): Promise<any>;
  getAllCustomAdv(): Promise<any>;
  searchCustomAdv(): Promise<any>;
}

export class CustomAdvApiClient {
  static getASpecificCustomAdv(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CustomAdv.url({id}),
        method: Endpoints.CustomAdv.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve custom adv (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve custom adv.');
        return Promise.reject(error);
      });
  }
  static getAllCustomAdv(): Promise<any> {
    return client
      .request({
        url: Endpoints.CustomAdvList.url({}),
        method: Endpoints.CustomAdvList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve custom advs (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve custom advs.');
        return Promise.reject(error);
      });
  }
  static searchCustomAdv(): Promise<any> {
    return client
      .request({
        url: Endpoints.CustomAdvSearch.url({}),
        method: Endpoints.CustomAdvSearch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve custom advs (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve custom advs.');
        return Promise.reject(error);
      });
  }
}

export default class CustomAdvService {
  static async getASpecificCustomAdv(id: number): Promise<any> {
    return CustomAdvApiClient.getASpecificCustomAdv(id);
  }
  static async getAllCustomAdv(): Promise<any> {
    return CustomAdvApiClient.getAllCustomAdv();
  }
  static async searchCustomAdv(): Promise<any> {
    return CustomAdvApiClient.searchCustomAdv();
  }
}
