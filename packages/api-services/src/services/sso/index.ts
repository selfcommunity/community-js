import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface SSOApiClientInterface {
  SignIn(): Promise<any>;
  SignUp(): Promise<any>;
}

export class SSOApiClient {
  static SignIn(): Promise<any> {
    return client
      .request({
        url: Endpoints.SignIn.url({}),
        method: Endpoints.SignIn.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
  static SignUp(): Promise<any> {
    return client
      .request({
        url: Endpoints.SignUp.url({}),
        method: Endpoints.SignUp.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
}

export default class SSOService {
  static async SignIn(): Promise<any> {
    return SSOApiClient.SignIn();
  }
  static async SignUp(): Promise<any> {
    return SSOApiClient.SignUp();
  }
}
