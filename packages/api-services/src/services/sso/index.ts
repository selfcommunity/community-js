import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SSOSignInType, SSOSignUpType} from '@selfcommunity/types/src/types/sso';
import {SSOSignUpParams} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface SSOApiClientInterface {
  SignIn(config?: AxiosRequestConfig): Promise<SSOSignInType>;
  SignUp(data: SSOSignUpParams, config?: AxiosRequestConfig): Promise<SSOSignUpType>;
}
/**
 * Contains all the endpoints needed to manage sso.
 */

export class SSOApiClient {
  /**
   * This endpoint signs in the user authenticated with the access token.
   * @param config
   */
  static SignIn(config?: AxiosRequestConfig): Promise<SSOSignInType> {
    return apiRequest({...config, url: Endpoints.SignIn.url({}), method: Endpoints.SignIn.method});
  }

  /**
   * This endpoint creates a new account.
   * Only users with the admin role can register new users.
   * @param data
   * @param config
   */
  static SignUp(data: SSOSignUpParams, config?: AxiosRequestConfig): Promise<SSOSignUpType> {
    return apiRequest({...config, url: Endpoints.SignUp.url({}), method: Endpoints.SignUp.method, data: data});
  }
}

/**
 *
 :::tipSSO service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {SSOService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `SignUp` will return the user registration data. It takes the username and ext_id obj as body params.

 async SignUp() {
       const data = {username: 'string', ext_id: 'number'};
         return await SSOService.SignUp(data);
       }
 ```
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class SSOService {
  static async SignIn(config?: AxiosRequestConfig): Promise<SSOSignInType> {
    return SSOApiClient.SignIn(config);
  }
  static async SignUp(data: SSOSignUpParams, config?: AxiosRequestConfig): Promise<SSOSignUpType> {
    return SSOApiClient.SignUp(data, config);
  }
}
