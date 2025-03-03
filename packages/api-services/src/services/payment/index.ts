import {SCContentProduct, SCProductPrice} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import Endpoints from '../../constants/Endpoints';
import {BaseGetParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {urlParams} from '../../utils/url';
import {CheckoutCreateSessionParams, ContentProductsParams} from '../../types/payment';
import {SCCheckoutSession} from '@selfcommunity/types';

export interface PaymentApiClientInterface {
  /**
   * Get paywall products related to an object of type <content_type> and id <content_id>
   * @param params
   * @param config
   */
  getContentProducts(params?: ContentProductsParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCContentProduct>>;

  /**
   * Get prices related to a product
   * @param id
   * @param params
   * @param config
   */
  getProductPrices(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCProductPrice>>;

  /**
   * Create session checkout with price_id for an object of type <content_type> and id <content_id>
   * @param content_id
   * @param content_type
   * @param price_id
   * @param config
   */
  checkoutCreateSession(content_id: number | string, content_type: number | string, price_id: string, config?: AxiosRequestConfig): Promise<any>;
}

/**
 * Contains all the endpoints needed to manage payments.
 */
export class PaymentApiClient {
  /**
   * This endpoint retrieves all the products related to an object of type <content_type> and id <content_id>
   * @param params
   * @param config
   */
  static getContentProducts(params?: ContentProductsParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCContentProduct>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetContentProducts.url({})}?${p.toString()}`, method: Endpoints.GetContentProducts.method});
  }

  /**
   * This endpoint retrieves all the prices related to a product
   * @param id
   * @param params
   * @param config
   */
  static getProductPrices(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCProductPrice>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetProductPrices.url({id})}?${p.toString()}`, method: Endpoints.GetProductPrices.method});
  }

  /**
   * This endpoint creates a course.
   * @param data
   * @param config
   */
  static checkoutCreateSession(data: CheckoutCreateSessionParams | FormData, config?: AxiosRequestConfig): Promise<SCCheckoutSession> {
    return apiRequest({...config, url: Endpoints.CheckoutCreateSession.url({}), method: Endpoints.CheckoutCreateSession.method, data});
  }
}

/**
 *
 :::tip Payment service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {PaymentService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `searchCourses` will return the events matching the search query.

 async getContentProducts() {
         return await PaymentService.getContentProducts({...});
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getProductPrices(eventId) {
         return await PaymentService.getProductPrices(id);
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
export default class PaymentService {
  static async getJoinedCourses(params?: ContentProductsParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCContentProduct>> {
    return PaymentApiClient.getContentProducts(params, config);
  }
  static async getProductPrices(
    id: number | string,
    params?: ContentProductsParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCProductPrice>> {
    return PaymentApiClient.getProductPrices(id, params, config);
  }
  static async createCourse(data: CheckoutCreateSessionParams | FormData, config?: AxiosRequestConfig): Promise<SCCheckoutSession> {
    return PaymentApiClient.checkoutCreateSession(data, config);
  }
}
