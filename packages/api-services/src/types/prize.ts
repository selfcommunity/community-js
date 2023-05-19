import {SCUserType} from '@selfcommunity/types';
import {BaseSearchParams} from './baseParams';

/**
 * LoyaltyGetPrizeParams interface
 */

export interface LoyaltyGetPrizeParams extends BaseSearchParams {
  /**
   * Filter by active only for editor or admin users
   */
  active?: string;
  /**
   * Which field to use when ordering the results
   */
  ordering?: string;
}

/**
 * LoyaltyPrizeParams interface
 */
export interface LoyaltyPrizeParams {
  /**
   * Unique integer value
   */
  id?: number;
  /**
   * 	Is this prize active?
   */
  active?: true;
  /**
   * The title of the prize
   */
  title: string;
  /**
   * A description of the prize
   */
  description?: string;
  /**
   * Points to request this prize
   */
  points: number;
  /**
   * Link to a web resource for this prize
   */
  link?: string;
  /**
   * Image of this prize
   */
  image: string;
  /**
   * 	Date of creation
   */
  created_at?: Date | string;
  /**
   * Date of last modify
   */
  lastmod_datetime?: Date | string;
  /**
   * The user who created the prize
   */
  created_by?: SCUserType;
}
