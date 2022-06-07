import {FeatureParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCFeatureType} from '@selfcommunity/types';

export interface FeatureApiClientInterface {
  getAllFeatures(params?: FeatureParams): Promise<SCPaginatedResponse<SCFeatureType[]>>;
}
/**
 * Contains all the endpoints needed to manage features.
 */

export class FeatureApiClient {
  /**
   * This endpoint retrieves all features.
   * @param params
   */
  static getAllFeatures(params?: FeatureParams): Promise<SCPaginatedResponse<SCFeatureType[]>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.Feature.url({})}?${p.toString()}`, Endpoints.Feature.method);
  }
}

export default class FeatureService {
  static async getAllFeatures(params?: FeatureParams): Promise<SCPaginatedResponse<SCFeatureType[]>> {
    return FeatureApiClient.getAllFeatures(params);
  }
}
