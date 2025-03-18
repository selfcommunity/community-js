import {AxiosRequestConfig} from 'axios';
import Endpoints from '../../constants/Endpoints';
import {BaseGetParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {urlParams} from '../../utils/url';
import {SCCommunity} from '@selfcommunity/types';

export interface CommunityApiClientInterface {
  /**
   * Get list of communities. Used to get the payment products related to the community (aka paywalls)
   * @param params
   * @param config
   */
  getCommunities(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCommunity>>;

  /**
   * Get Community
   * @param id
   * @param config
   */
  getCommunity(id: number | string, config?: AxiosRequestConfig): Promise<SCCommunity>;
}

/**
 * Contains all the endpoints needed to manage payments.
 */
export class CommunityApiClient {
  /**
   * Get list of communities. Used to get the payment products related to the community (aka paywalls)
   * @param params
   * @param config
   */
  static getCommunities(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCommunity>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetCommunities.url({})}?${p.toString()}`, method: Endpoints.GetCommunities.method});
  }

  /**
   * Get Community
   * @param id
   * @param config
   */
  static getCommunity(id: number | string, config?: AxiosRequestConfig): Promise<SCCommunity> {
    return apiRequest({...config, url: Endpoints.GetCommunity.url({id}), method: Endpoints.GetCommunity.method});
  }
}

/**
 *
 :::tip Community service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {CommunityService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getCommunities` will return the events matching the search query.

 async getCommunities() {
         return await CommunityService.getCommunities({...});
        }
 ```
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class CommunityService {
  static async getCommunities(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCommunity>> {
    return CommunityApiClient.getCommunities(params, config);
  }
  static async getPaymentProduct(id: number | string, config?: AxiosRequestConfig): Promise<SCCommunity> {
    return CommunityApiClient.getCommunity(id, config);
  }
}
