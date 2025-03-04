import {SCPaymentProduct, SCPaymentPrice} from '@selfcommunity/types';
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
  getPaymentProducts(params?: ContentProductsParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPaymentProduct>>;

  /**
   * Get prices related to a product
   * @param id
   * @param params
   * @param config
   */
  getPaymentProductPrices(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPaymentPrice>>;

  /**
   * Create session checkout with price_id for an object of type <content_type> and id <content_id>
   * @param content_id
   * @param content_type
   * @param price_id
   * @param config
   */
  checkoutCreateSession(content_id: number | string, content_type: number | string, price_id: string, config?: AxiosRequestConfig): Promise<any>;

  /**
   * This endpoint retrieve checkout session
   * @param id
   * @param config
   */
  getCheckoutSession(id: string, config?: AxiosRequestConfig): Promise<SCCheckoutSession>;
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
  static getPaymentProducts(params?: ContentProductsParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPaymentProduct>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetContentProducts.url({})}?${p.toString()}`, method: Endpoints.GetContentProducts.method});
  }

  /**
   * This endpoint retrieves all the prices related to a product
   * @param id
   * @param params
   * @param config
   */
  static getPaymentProductPrices(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPaymentPrice>> {
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

  /**
   * This endpoint retrieve checkout session
   * @param id
   * @param config
   */
  static getCheckoutSession(id: string, config?: AxiosRequestConfig): Promise<SCCheckoutSession> {
    return apiRequest({...config, url: `${Endpoints.GetCheckoutSession.url({id})}`, method: Endpoints.GetCheckoutSession.method});
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

 async getPaymentProducts() {
         return await PaymentService.getPaymentProducts({...});
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getPaymentPrices(eventId) {
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
  static async getPaymentProducts(params?: ContentProductsParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPaymentProduct>> {
    return PaymentApiClient.getPaymentProducts(params, config);
  }
  static async getPaymentProductPrices(
    id: number | string,
    params?: ContentProductsParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCPaymentPrice>> {
    return PaymentApiClient.getPaymentProductPrices(id, params, config);
  }
  static async checkoutCreateSession(data: CheckoutCreateSessionParams | FormData, config?: AxiosRequestConfig): Promise<SCCheckoutSession> {
    return PaymentApiClient.checkoutCreateSession(data, config);
  }
  static async getCheckoutSession(id: string, config?: AxiosRequestConfig): Promise<SCCheckoutSession> {
    return PaymentApiClient.getCheckoutSession(id, config);
  }
}
