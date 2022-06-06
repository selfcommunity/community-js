import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SSOSignInType, SSOSignUpType} from '@selfcommunity/types/src/types/sso';
import {SSOSignUpParams} from '../../types';

export interface SSOApiClientInterface {
  SignIn(token: string): Promise<SSOSignInType>;
  SignUp(token: string, data: SSOSignUpParams): Promise<SSOSignUpType>;
}
/**
 * Contains all the endpoints needed to manage sso.
 */

export class SSOApiClient {
  /**
   * This endpoint signs in the user authenticated with the access token.
   * @param token
   */
  static SignIn(token: string): Promise<SSOSignInType> {
    return apiRequest(Endpoints.SignIn.url({}), Endpoints.SignIn.method, token);
  }

  /**
   * This endpoint creates a new account.
   * Only users with the admin role can register new users.
   * @param token
   * @param data
   */
  static SignUp(token: string, data: SSOSignUpParams): Promise<SSOSignUpType> {
    return apiRequest(Endpoints.SignUp.url({}), Endpoints.SignUp.method, token, data);
  }
}

export default class SSOService {
  static async SignIn(token: string): Promise<SSOSignInType> {
    return SSOApiClient.SignIn(token);
  }
  static async SignUp(token: string, data: SSOSignUpParams): Promise<SSOSignUpType> {
    return SSOApiClient.SignUp(token, data);
  }
}
