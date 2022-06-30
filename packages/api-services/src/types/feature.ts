import {BaseSearchParams} from './baseParams';

/**
 * FeatureParams interface
 */
export interface FeatureParams extends BaseSearchParams {
  /**
   * 	Filter using field name.
   */
  name?: string;
}
