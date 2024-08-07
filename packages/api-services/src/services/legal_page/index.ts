import Endpoints from '../../constants/Endpoints';
import {LegalPageFilterParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLegalPageAckType, SCLegalPageType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface LegalPageApiClientInterface {
  getLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getSpecificLegalPage(id: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageType>;
  getAllRevisionsOfLegalPage(policy: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getLastRevisionOfLegalPage(policy: string, config?: AxiosRequestConfig): Promise<SCLegalPageType>;
  searchLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>>;
  ackLegalPage(id: number | string, accept?: number, config?: AxiosRequestConfig): Promise<SCLegalPageAckType>;
  getSpecificUserAck(id: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageAckType>;
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
  static getSpecificLegalPage(id: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageType> {
    return apiRequest({...config, url: Endpoints.LegalPage.url({id}), method: Endpoints.LegalPage.method});
  }

  /**
   * This endpoint retrieves all revisions of a legal page.
   * @param policy
   * @param config
   */
  static getAllRevisionsOfLegalPage(policy: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return apiRequest({...config, url: Endpoints.LegalPageRevisions.url({policy}), method: Endpoints.LegalPageRevisions.method});
  }

  /**
   * This endpoint retrieves all last revisions of legal pages.
   */
  static getAllLastRevisionsOfLegalPages(config?: AxiosRequestConfig): Promise<SCLegalPageType[]> {
    return apiRequest({...config, url: Endpoints.LegalPagesLastRevision.url({}), method: Endpoints.LegalPagesLastRevision.method});
  }

  /**
   * This endpoint retrieves last revision of a legal page.
   * @param policy
   * @param config
   */
  static getLastRevisionOfLegalPage(policy: string, config?: AxiosRequestConfig): Promise<SCLegalPageType> {
    return apiRequest({...config, url: Endpoints.LegalPageLastRevision.url({policy}), method: Endpoints.LegalPageLastRevision.method});
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
  static ackLegalPage(id: number | string, accept?: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageAckType> {
    return apiRequest({...config, url: Endpoints.AckLegalPage.url({id}), method: Endpoints.AckLegalPage.method, data: {accept: accept} ?? null});
  }

  /**
   * This endpoint retrieves a specific user ack.
   * @param id
   * @param config
   */
  static getSpecificUserAck(id: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageAckType> {
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
 :::tip LegalPage service can be used in the following way:

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

  static async getSpecificLegalPage(id: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageType> {
    return LegalPageApiClient.getSpecificLegalPage(id, config);
  }

  static async getAllRevisionsOfLegalPage(policy: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.getAllRevisionsOfLegalPage(policy, config);
  }

  static async getAllLastRevisionsOfLegalPages(config?: AxiosRequestConfig): Promise<SCLegalPageType[]> {
    return LegalPageApiClient.getAllLastRevisionsOfLegalPages(config);
  }

  static async getLastRevisionOfLegalPage(policy: string, config?: AxiosRequestConfig): Promise<SCLegalPageType> {
    return LegalPageApiClient.getLastRevisionOfLegalPage(policy, config);
  }

  static async searchLegalPages(params?: LegalPageFilterParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.searchLegalPages(params, config);
  }

  static async ackLegalPage(id: number | string, accept?: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageAckType> {
    return LegalPageApiClient.ackLegalPage(id, accept, config);
  }

  static async getSpecificUserAck(id: number | string, config?: AxiosRequestConfig): Promise<SCLegalPageAckType> {
    return LegalPageApiClient.getSpecificUserAck(id, config);
  }

  static async userAckList(config?: AxiosRequestConfig): Promise<SCLegalPageAckType[]> {
    return LegalPageApiClient.userAckList(config);
  }
}
