import Endpoints from '../../constants/Endpoints';
import {ContactUsRequestParams} from '../../types';
import {type SCContactUsRequestType} from '@selfcommunity/types';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';

export interface ContactUsApiClientInterface {
  request(data?: ContactUsRequestParams, config?: AxiosRequestConfig): Promise<SCContactUsRequestType>;
}

/**
 * Contains all the endpoints needed to contact-us.
 */
export class ContactUsApiClient {
  /**
   * This endpoint create an contact request.
   *
   * It requires an authenticated user.
   *
   * @param data
   * @param config
   */
  static request(data?: ContactUsRequestParams, config?: AxiosRequestConfig): Promise<SCContactUsRequestType> {
    return apiRequest({...config, data, url: Endpoints.ContactRequest.url({}), method: Endpoints.ContactRequest.method});
  }
}

/**
 *
 :::tip Contact service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {ContactService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `create` will return the paginated list of categories.

 async create() {
   return await ContactService.request();
 }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async request(data) {
  return await ContactService.request(data);
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
export default class ContactUsService {
  static async request(data?: ContactUsRequestParams, config?: AxiosRequestConfig): Promise<SCContactUsRequestType> {
    return ContactUsApiClient.request(data, config);
  }
}
