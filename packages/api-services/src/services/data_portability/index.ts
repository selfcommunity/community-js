import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCDataPortabilityType} from '@selfcommunity/types';

export interface DataPortabilityApiClientInterface {
  generateDataPortability(): Promise<SCDataPortabilityType>;
  downloadDataPortability(): Promise<any>;
  dataPortabilityStatus(): Promise<SCDataPortabilityType>;
}
/**
 * Contains all the endpoints needed to manage data portability.
 */

export class DataPortabilityApiClient {
  /**
   * This endpoint generates data portability.
   */
  static generateDataPortability(): Promise<SCDataPortabilityType> {
    return apiRequest(Endpoints.GenerateDataPortability.url({}), Endpoints.GenerateDataPortability.method);
  }

  /**
   * This endpoint downloads data portability.
   */
  static downloadDataPortability(): Promise<any> {
    return apiRequest(Endpoints.DataPortabilityDownload.url({}), Endpoints.DataPortabilityDownload.method);
  }

  /**
   * This endpoint retrieves data portability status.
   */
  static dataPortabilityStatus(): Promise<SCDataPortabilityType> {
    return apiRequest(Endpoints.DataPortabilityStatus.url({}), Endpoints.DataPortabilityStatus.method);
  }
}

/**
 *
 :::tipData Portability service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {DataPortabilityService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `generateDataPortability` will return the generated data portability.

 async generateDataPortability() {
      return await DataPortabilityService.generateDataPortability();
      }
 ```
 :::
 */
export default class DataPortabilityService {
  static async generateDataPortability(): Promise<SCDataPortabilityType> {
    return DataPortabilityApiClient.generateDataPortability();
  }
  static async downloadDataPortability(): Promise<any> {
    return DataPortabilityApiClient.downloadDataPortability();
  }
  static async dataPortabilityStatus(): Promise<SCDataPortabilityType> {
    return DataPortabilityApiClient.dataPortabilityStatus();
  }
}
