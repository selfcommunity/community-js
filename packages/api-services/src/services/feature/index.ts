import {FeatureParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeatureType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';

export interface FeatureApiClientInterface {
  getAllFeatures(params?: FeatureParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeatureType[]>>;
}
/**
 * Contains all the endpoints needed to manage features.
 */

export class FeatureApiClient {
  /**
   * This endpoint retrieves all features.
   * @param params
   * @param config
   */
  static getAllFeatures(params?: FeatureParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeatureType[]>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.Feature.url({})}?${p.toString()}`, method: Endpoints.Feature.method});
  }
}

/**
 *
 :::tipFeature service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {FeatureService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllFeatures` will return the paginated list of features.

 async getAllFeatures() {
        return await FeatureService.getAllFeatures();
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
export default class FeatureService {
  static async getAllFeatures(params?: FeatureParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeatureType[]>> {
    return FeatureApiClient.getAllFeatures(params, config);
  }
}
