import {BaseSearchParams} from './baseParams';

/**
 * CustomAdvParams interface
 */

export interface CustomAdvParams extends BaseSearchParams {
  /**
   * 	Filter using field position.
   */
  position?: string;
  /**
   * Filter using field category.
   */
  category?: string;
  /**
   * Filter using field active (only if user is administrator or editor).
   */
  active?: boolean;
}
