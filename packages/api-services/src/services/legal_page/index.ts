import Endpoints from '../../constants/Endpoints';
import {LegalPageFilterParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLegalPageAckType, SCLegalPageType} from '@selfcommunity/types';

export interface LegalPageApiClientInterface {
  getLegalPages(params?: LegalPageFilterParams): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getSpecificLegalPage(id: number): Promise<SCLegalPageType>;
  searchLegalPages(params?: LegalPageFilterParams): Promise<SCPaginatedResponse<SCLegalPageType>>;
  ackLegalPage(id: number, accept?: number): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getSpecificUserAck(id: number): Promise<SCLegalPageAckType>;
  userAckList(): Promise<SCLegalPageAckType[]>;
}
/**
 * Contains all the endpoints needed to manage legal pages.
 */

export class LegalPageApiClient {
  /**
   * This endpoint retrieves all legal pages.
   * @param params
   */
  static getLegalPages(params?: LegalPageFilterParams): Promise<SCPaginatedResponse<SCLegalPageType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.GetLegalPages.url({})}?${p.toString()}`, Endpoints.GetLegalPages.method);
  }
  /**
   * This endpoint retrieves a specific legal page.
   */
  static getSpecificLegalPage(id: number): Promise<SCLegalPageType> {
    return apiRequest(Endpoints.LegalPage.url({id}), Endpoints.LegalPage.method);
  }

  /**
   * This endpoint performs search of a Legal Page.
   * @param params
   */
  static searchLegalPages(params?: LegalPageFilterParams): Promise<SCPaginatedResponse<SCLegalPageType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.SearchLegalPages.url({})}?${p.toString()}`, Endpoints.SearchLegalPages.method);
  }

  /**
   *
   * @param id
   * @param accept Accept or not accept a legal page, valid values are: ('true', 'on', '1').
   */
  static ackLegalPage(id: number, accept?: number): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return apiRequest(Endpoints.AckLegalPage.url({id}), Endpoints.AckLegalPage.method, {accept: accept} ?? null);
  }

  /**
   * This endpoint retrieves a specific user ack.
   * @param id
   */
  static getSpecificUserAck(id: number): Promise<SCLegalPageAckType> {
    return apiRequest(Endpoints.SpecificUserAck.url({id}), Endpoints.SpecificUserAck.method);
  }

  /**
   * This endpoint retrieves all user acks.
   */
  static userAckList(): Promise<SCLegalPageAckType[]> {
    return apiRequest(Endpoints.UserAckList.url({}), Endpoints.UserAckList.method);
  }
}

export default class LegalPageService {
  /**
   *
   :::tipLegalPage service can be used in the following ways:

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
   :::
   */
  static async getLegalPages(params?: LegalPageFilterParams): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.getLegalPages(params);
  }

  static async getSpecificLegalPage(id: number): Promise<SCLegalPageType> {
    return LegalPageApiClient.getSpecificLegalPage(id);
  }

  static async searchLegalPages(params?: LegalPageFilterParams): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.searchLegalPages(params);
  }

  static async ackLegalPage(id: number, accept?: number): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.ackLegalPage(id, accept);
  }

  static async getSpecificUserAck(id: number): Promise<SCLegalPageAckType> {
    return LegalPageApiClient.getSpecificUserAck(id);
  }

  static async userAckList(): Promise<SCLegalPageAckType[]> {
    return LegalPageApiClient.userAckList();
  }
}
