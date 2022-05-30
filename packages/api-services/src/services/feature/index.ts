import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeatureType} from '@selfcommunity/types';

export interface FeatureApiClientInterface {
  getAllFeatures(): Promise<SCPaginatedResponse<SCFeatureType[]>>;
}
/**
 * Contains all the endpoints needed to manage features.
 */

export class FeatureApiClient {
  /**
   * This endpoint retrieves all features.
   */
  static getAllFeatures(): Promise<SCPaginatedResponse<SCFeatureType[]>> {
    return apiRequest(Endpoints.Feature.url({}), Endpoints.Feature.method);
  }
}

export default class FeatureService {
  static async getAllFeatures(): Promise<SCPaginatedResponse<SCFeatureType[]>> {
    return FeatureApiClient.getAllFeatures();
  }
}
