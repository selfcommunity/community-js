import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCDataPortabilityType} from '@selfcommunity/types';

export interface DataPortabilityApiClientInterface {
  generateDataPortability(token: string): Promise<SCDataPortabilityType>;
  downloadDataPortability(token: string): Promise<any>;
  dataPortabilityStatus(token: string): Promise<SCDataPortabilityType>;
}
/**
 * Contains all the endpoints needed to manage data portability.
 */

export class DataPortabilityApiClient {
  /**
   * This endpoint generates data portability.
   * @param token
   */
  static generateDataPortability(token: string): Promise<SCDataPortabilityType> {
    return apiRequest(Endpoints.GenerateDataPortability.url({}), Endpoints.GenerateDataPortability.method, token);
  }

  /**
   * This endpoint downloads data portability.
   * @param token
   */
  static downloadDataPortability(token: string): Promise<any> {
    return apiRequest(Endpoints.DataPortabilityDownload.url({}), Endpoints.DataPortabilityDownload.method, token);
  }

  /**
   * This endpoint retrieves data portability status.
   * @param token
   */
  static dataPortabilityStatus(token: string): Promise<SCDataPortabilityType> {
    return apiRequest(Endpoints.DataPortabilityStatus.url({}), Endpoints.DataPortabilityStatus.method, token);
  }
}

export default class DataPortabilityService {
  static async generateDataPortability(token: string): Promise<SCDataPortabilityType> {
    return DataPortabilityApiClient.generateDataPortability(token);
  }
  static async downloadDataPortability(token: string): Promise<any> {
    return DataPortabilityApiClient.downloadDataPortability(token);
  }
  static async dataPortabilityStatus(token: string): Promise<SCDataPortabilityType> {
    return DataPortabilityApiClient.dataPortabilityStatus(token);
  }
}
