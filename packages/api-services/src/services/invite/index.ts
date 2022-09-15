import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {SCInviteType} from '@selfcommunity/types';

export interface InviteApiClientInterface {
  getSpecificInvite(code: string, config?: AxiosRequestConfig): Promise<SCInviteType>;
}

/**
 * Contains all the endpoints needed to manage invite codes.
 */
export class InviteApiClient {
  /**
   * This endpoint retrieves a specific invite identified by invite code.
   * @param code
   * @param config
   */
  static getSpecificInvite(code: string, config?: AxiosRequestConfig): Promise<SCInviteType> {
    return apiRequest({...config, url: Endpoints.InviteCode.url({code}), method: Endpoints.User.method});
  }
}

/**
 *
 :::tip Invite service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {InviteService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `create` will return the paginated list of categories.

 async getSpecificInviteCode() {
   return await InviteService.getSpecificInvite();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async create(data) {
  return await InviteService.getSpecificInvite(code);
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
export default class InviteService {
  static async getSpecificInvite(code: string, config?: AxiosRequestConfig): Promise<SCInviteType> {
    return InviteApiClient.getSpecificInvite(code, config);
  }
}
