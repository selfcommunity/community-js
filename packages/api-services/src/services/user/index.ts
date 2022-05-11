import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface UserApiClientInterface {
  getAllUsers(): Promise<any>;
  getSpecificUser(id: number): Promise<any>;
  getCurrentUser(): Promise<any>;
}

export class UserApiClient {
  static getAllUsers(): Promise<any> {
    return client
      .request({
        url: Endpoints.User.url({}),
        method: Endpoints.User.method
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

  static getSpecificUser(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.User.url({id}),
        method: Endpoints.User.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve user.');
        return Promise.reject(error);
      });
  }

  static getCurrentUser(): Promise<any> {
    return client
      .request({
        url: Endpoints.Me.url(),
        method: Endpoints.Me.method,
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve user profile.');
        return Promise.reject(error);
      });
  }
}

export default class UserService {
  static async getAllUsers(): Promise<any> {
    return UserApiClient.getAllUsers();
  }

  static async getSpecificUser(id: number): Promise<any> {
    return UserApiClient.getSpecificUser(id);
  }

  static async getCurrentUser(): Promise<any> {
    return UserApiClient.getCurrentUser();
  }
}
