import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SSOSignInType, SSOSignUpType} from '@selfcommunity/types/src/types/sso';
import {SSOSignUpParams} from '../../types';

export interface SSOApiClientInterface {
  SignIn(): Promise<SSOSignInType>;
  SignUp(data: SSOSignUpParams): Promise<SSOSignUpType>;
}

export class SSOApiClient {
  /**
   * This endpoint signs in the user authenticated with the access token.
   */
  static SignIn(): Promise<SSOSignInType> {
    return apiRequest(Endpoints.SignIn.url({}), Endpoints.SignIn.method);
  }

  /**
   * This endpoint creates a new account.
   * @constructor
   */
  static SignUp(data: SSOSignUpParams): Promise<SSOSignUpType> {
    return apiRequest(Endpoints.SignUp.url({}), Endpoints.SignUp.method, data);
  }
}

export default class SSOService {
  static async SignIn(): Promise<SSOSignInType> {
    return SSOApiClient.SignIn();
  }
  static async SignUp(data: SSOSignUpParams): Promise<SSOSignUpType> {
    return SSOApiClient.SignUp(data);
  }
}
