import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCDataPortabilityType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';

export interface DataPortabilityApiClientInterface {
  generateDataPortability(config?: AxiosRequestConfig): Promise<SCDataPortabilityType>;
  downloadDataPortability(config?: AxiosRequestConfig): Promise<any>;
  dataPortabilityStatus(config?: AxiosRequestConfig): Promise<SCDataPortabilityType>;
}
/**
 * Contains all the endpoints needed to manage data portability.
 */

export class DataPortabilityApiClient {
  /**
   * This endpoint generates data portability.
   * @param config
   */
  static generateDataPortability(config?: AxiosRequestConfig): Promise<SCDataPortabilityType> {
    return apiRequest({url: Endpoints.GenerateDataPortability.url({}), method: Endpoints.GenerateDataPortability.method, ...config});
  }

  /**
   * This endpoint downloads data portability.
   * @param config
   */
  static downloadDataPortability(config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({
      url: Endpoints.DataPortabilityDownload.url({}),
      method: Endpoints.DataPortabilityDownload.method,
      responseType: 'blob',
      ...config
    });
  }

  /**
   * This endpoint retrieves data portability status.
   * @param config
   */
  static dataPortabilityStatus(config?: AxiosRequestConfig): Promise<SCDataPortabilityType> {
    return apiRequest({url: Endpoints.DataPortabilityStatus.url({}), method: Endpoints.DataPortabilityStatus.method, ...config});
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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class DataPortabilityService {
  static async generateDataPortability(config?: AxiosRequestConfig): Promise<SCDataPortabilityType> {
    return DataPortabilityApiClient.generateDataPortability(config);
  }
  static async downloadDataPortability(config?: AxiosRequestConfig): Promise<any> {
    return DataPortabilityApiClient.downloadDataPortability(config);
  }
  static async dataPortabilityStatus(config?: AxiosRequestConfig): Promise<SCDataPortabilityType> {
    return DataPortabilityApiClient.dataPortabilityStatus(config);
  }
}
