import Endpoints from '../../constants/Endpoints';
import {LegalPageFilterParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLegalPageAckType, SCLegalPageType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface LegalPageApiClientInterface {
  getLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getSpecificLegalPage(id: number, config?: AxiosRequestConfig): Promise<SCLegalPageType>;
  searchLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>>;
  ackLegalPage(id: number, accept?: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getSpecificUserAck(id: number, config?: AxiosRequestConfig): Promise<SCLegalPageAckType>;
  userAckList(config?: AxiosRequestConfig): Promise<SCLegalPageAckType[]>;
}
/**
 * Contains all the endpoints needed to manage legal pages.
 */

export class LegalPageApiClient {
  /**
   * This endpoint retrieves all legal pages.
   * @param params
   * @param config
   */
  static getLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetLegalPages.url({})}?${p.toString()}`, method: Endpoints.GetLegalPages.method});
  }
  /**
   * This endpoint retrieves a specific legal page.
   * @param id
   * @param config
   */
  static getSpecificLegalPage(id: number, config?: AxiosRequestConfig): Promise<SCLegalPageType> {
    return apiRequest({...config, url: Endpoints.LegalPage.url({id}), method: Endpoints.LegalPage.method});
  }

  /**
   * This endpoint performs search of a Legal Page.
   * @param params
   * @param config
   */
  static searchLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchLegalPages.url({})}?${p.toString()}`, method: Endpoints.SearchLegalPages.method});
  }

  /**
   *
   * @param id
   * @param accept Accept or not accept a legal page, valid values are: ('true', 'on', '1').
   * @param config
   */
  static ackLegalPage(id: number, accept?: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return apiRequest({...config, url: Endpoints.AckLegalPage.url({id}), method: Endpoints.AckLegalPage.method, data: {accept: accept} ?? null});
  }

  /**
   * This endpoint retrieves a specific user ack.
   * @param id
   * @param config
   */
  static getSpecificUserAck(id: number, config?: AxiosRequestConfig): Promise<SCLegalPageAckType> {
    return apiRequest({...config, url: Endpoints.SpecificUserAck.url({id}), method: Endpoints.SpecificUserAck.method});
  }

  /**
   * This endpoint retrieves all user acks.
   */
  static userAckList(config?: AxiosRequestConfig): Promise<SCLegalPageAckType[]> {
    return apiRequest({...config, url: Endpoints.UserAckList.url({}), method: Endpoints.UserAckList.method});
  }
}

/**
 *
 :::tipLegalPage service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {LegalPageService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getLegalPages` will return the paginated list of legal pages.

 async getLegalPages() {
          return await LegalPageService.getLegalPages();
        }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificLegalPage(legalPageId) {
          return await LegalPageService.getSpecificLegalPage(legalPageId);
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
export default class LegalPageService {
  static async getLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.getLegalPages(params, config);
  }

  static async getSpecificLegalPage(id: number, config?: AxiosRequestConfig): Promise<SCLegalPageType> {
    return LegalPageApiClient.getSpecificLegalPage(id, config);
  }

  static async searchLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.searchLegalPages(params, config);
  }

  static async ackLegalPage(id: number, accept?: number, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.ackLegalPage(id, accept, config);
  }

  static async getSpecificUserAck(id: number, config?: AxiosRequestConfig): Promise<SCLegalPageAckType> {
    return LegalPageApiClient.getSpecificUserAck(id, config);
  }

  static async userAckList(config?: AxiosRequestConfig): Promise<SCLegalPageAckType[]> {
    return LegalPageApiClient.userAckList(config);
  }
}
