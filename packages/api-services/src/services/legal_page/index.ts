import Endpoints from '../../constants/Endpoints';
import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {SCLegalPageAckType, SCLegalPageType} from '@selfcommunity/types';

export interface LegalPageApiClientInterface {
  getLegalPages(): Promise<SCPaginatedResponse<SCLegalPageType>>;
  getSpecificLegalPage(id: number): Promise<SCLegalPageType>;
  searchLegalPages(): Promise<SCPaginatedResponse<SCLegalPageType>>;
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
   */
  static getLegalPages(): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return apiRequest(Endpoints.GetLegalPages.url({}), Endpoints.GetLegalPages.method);
  }
  /**
   * This endpoint retrieves a specific legal page.
   */
  static getSpecificLegalPage(id: number): Promise<SCLegalPageType> {
    return apiRequest(Endpoints.LegalPage.url({id}), Endpoints.LegalPage.method);
  }

  /**
   * This endpoint performs search of a Legal Page.
   */
  static searchLegalPages(): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return apiRequest(Endpoints.SearchLegalPages.url({}), Endpoints.SearchLegalPages.method);
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
  static async getLegalPages(): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.getLegalPages();
  }

  static async getSpecificLegalPage(id: number): Promise<SCLegalPageType> {
    return LegalPageApiClient.getSpecificLegalPage(id);
  }

  static async searchLegalPages(): Promise<SCPaginatedResponse<SCLegalPageType>> {
    return LegalPageApiClient.searchLegalPages();
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
