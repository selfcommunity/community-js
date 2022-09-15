import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {SCInviteCodeType} from '@selfcommunity/types';

export interface InviteCodeApiClientInterface {
  getSpecificInviteCode(invite_code: string, config?: AxiosRequestConfig): Promise<SCInviteCodeType>;
}

/**
 * Contains all the endpoints needed to manage invite codes.
 */
export class InviteCodeApiClient {
  /**
   * This endpoint retrieves a specific invite code identified by invite_code.
   * @param invite_code
   * @param config
   */
  static getSpecificInviteCode(invite_code: string, config?: AxiosRequestConfig): Promise<SCInviteCodeType> {
    return apiRequest({...config, url: Endpoints.InviteCode.url({invite_code}), method: Endpoints.User.method});
  }
}

/**
 *
 :::tip InviteCode service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {InviteCodeService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `create` will return the paginated list of categories.

 async getSpecificInviteCode() {
   return await InviteCodeService.getSpecificInviteCode();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async create(data) {
  return await InviteCodeService.getSpecificInviteCode(invite_code);
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
export default class InviteCodeService {
  static async getSpecificInviteCode(invite_code: string, config?: AxiosRequestConfig): Promise<SCInviteCodeType> {
    return InviteCodeApiClient.getSpecificInviteCode(invite_code, config);
  }
}
