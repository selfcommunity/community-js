import {BaseSearchParams} from './baseParams';

/**
 * CategoryParams interface
 */

export interface CategoryParams extends BaseSearchParams {
  /**
   * Filter using field active (only if user is administrator).
   */
  active?: boolean;
  /**
   * 	Filter using field deleted (only if user is administrator).
   */
  deleted?: boolean;
}
