import {BaseGetParams} from './baseParams';

/**
 * interface ScoreParams
 */
export interface ScoreParams extends BaseGetParams {
  /**
   * A search term.
   */
  search?: string;
  /**
   * The id of a specific user
   */
  user_id?: number;
  /**
   * Which field to use when ordering the results.
   */
  ordering?: string;
}
