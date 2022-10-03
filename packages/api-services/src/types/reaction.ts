import {BaseSearchParams} from './baseParams';

/**
 * ReactionParams interface
 */

export interface ReactionParams extends BaseSearchParams {
  /**
   * Filter using field active.
   */
  active?: boolean;
  /**
   * Which field to use when ordering the results.
   */
  ordering?: string;
}
