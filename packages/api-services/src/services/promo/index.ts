import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {SCPromoType} from '@selfcommunity/types';

export interface PromoApiClientInterface {
  getSpecificPromo(code: string, config?: AxiosRequestConfig): Promise<SCPromoType>;
}

/**
 * Contains all the endpoints needed to manage Promo codes.
 */
export class PromoApiClient {
  /**
   * This endpoint retrieves a specific Promo identified by Promo code.
   * @param code
   * @param config
   */
  static getSpecificPromo(code: string, config?: AxiosRequestConfig): Promise<SCPromoType> {
    return apiRequest({...config, url: Endpoints.PromoCode.url({code}), method: Endpoints.User.method});
  }
}

/**
 *
 :::tip Promo service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {PromoService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `create` will return the paginated list of categories.

 async getSpecificPromoCode() {
   return await PromoService.getSpecificPromo();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async create(data) {
  return await PromoService.getSpecificPromo(code);
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
export default class PromoService {
  static async getSpecificPromo(code: string, config?: AxiosRequestConfig): Promise<SCPromoType> {
    return PromoApiClient.getSpecificPromo(code, config);
  }
}
