import Endpoints from '../../constants/Endpoints';
import {AccountCreateParams, AccountRecoverParams, AccountResetParams, AccountSearchParams, AccountVerifyParams} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {SCUserType} from '@selfcommunity/types';

export interface AccountApiClientInterface {
  create(data?: AccountCreateParams, config?: AxiosRequestConfig): Promise<SCUserType>;
  verify(data?: AccountVerifyParams, config?: AxiosRequestConfig): Promise<any>;
  recover(data?: AccountRecoverParams, config?: AxiosRequestConfig): Promise<any>;
  reset(data?: AccountResetParams, config?: AxiosRequestConfig): Promise<any>;
  search(params?: AccountSearchParams, config?: AxiosRequestConfig): Promise<SCUserType>;
}

/**
 * Contains all the endpoints needed to manage categories.
 */
export class AccountApiClient {
  /**
   * This endpoint create an account.
   *
   * It requires an administration token.
   *
   * @param data
   * @param config
   */
  static create(data?: AccountCreateParams, config?: AxiosRequestConfig): Promise<SCUserType> {
    return apiRequest({...config, data, url: Endpoints.AccountCreate.url({}), method: Endpoints.AccountCreate.method});
  }
  /**
   * This endpoint verify an account.
   * @param data
   * @param config
   */
  static verify(data?: AccountVerifyParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, data, url: Endpoints.AccountVerify.url({}), method: Endpoints.AccountVerify.method});
  }
  /**
   * This endpoint verify if a validation code is valid.
   * @param data
   * @param config
   */
  static verifyValidationCode(data?: AccountVerifyParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, data, url: Endpoints.AccountVerifyValidationCode.url({}), method: Endpoints.AccountVerifyValidationCode.method});
  }
  /**
   * This endpoint recover an account.
   * @param data
   * @param config
   */
  static recover(data?: AccountRecoverParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, data, url: Endpoints.AccountRecover.url({}), method: Endpoints.AccountRecover.method});
  }
  /**
   * This endpoint reset an account.
   * @param data
   * @param config
   */
  static reset(data?: AccountResetParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, data, url: Endpoints.AccountReset.url({}), method: Endpoints.AccountReset.method});
  }
  /**
   * This endpoint search an account.
   *
   * It requires an administration token.
   *
   * @param params
   * @param config
   */
  static search(params?: AccountSearchParams, config?: AxiosRequestConfig): Promise<SCUserType> {
    return apiRequest({...config, params, url: Endpoints.AccountSearch.url({}), method: Endpoints.AccountSearch.method});
  }
}

/**
 *
 :::tip Account service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {AccountService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `create` will return the paginated list of categories.

 async create() {
   return await AccountService.create();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async create(data) {
  return await AccountService.create(data);
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
export default class AccountService {
  static async create(data?: AccountCreateParams, config?: AxiosRequestConfig): Promise<SCUserType> {
    return AccountApiClient.create(data, config);
  }
  static async verify(data?: AccountVerifyParams, config?: AxiosRequestConfig): Promise<any> {
    return AccountApiClient.verify(data, config);
  }
  static async verifyValidationCode(params?: AccountVerifyParams, config?: AxiosRequestConfig): Promise<SCUserType> {
    return AccountApiClient.verifyValidationCode(params, config);
  }
  static async recover(data?: AccountRecoverParams, config?: AxiosRequestConfig): Promise<any> {
    return AccountApiClient.recover(data, config);
  }
  static async reset(data?: AccountResetParams, config?: AxiosRequestConfig): Promise<any> {
    return AccountApiClient.reset(data, config);
  }
  static async search(params?: AccountSearchParams, config?: AxiosRequestConfig): Promise<SCUserType> {
    return AccountApiClient.search(params, config);
  }
}
