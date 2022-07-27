import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SSOSignInType, SSOSignUpType} from '@selfcommunity/types/src/types/sso';
import {SSOSignUpParams} from '../../types';

export interface SSOApiClientInterface {
  SignIn(): Promise<SSOSignInType>;
  SignUp(data: SSOSignUpParams): Promise<SSOSignUpType>;
}
/**
 * Contains all the endpoints needed to manage sso.
 */

export class SSOApiClient {
  /**
   * This endpoint signs in the user authenticated with the access token.
   */
  static SignIn(): Promise<SSOSignInType> {
    return apiRequest(Endpoints.SignIn.url({}), Endpoints.SignIn.method);
  }

  /**
   * This endpoint creates a new account.
   * Only users with the admin role can register new users.
   * @param data
   */
  static SignUp(data: SSOSignUpParams): Promise<SSOSignUpType> {
    return apiRequest(Endpoints.SignUp.url({}), Endpoints.SignUp.method, data);
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
 :::
 */
export default class SSOService {
  static async SignIn(): Promise<SSOSignInType> {
    return SSOApiClient.SignIn();
  }
  static async SignUp(data: SSOSignUpParams): Promise<SSOSignUpType> {
    return SSOApiClient.SignUp(data);
  }
}
