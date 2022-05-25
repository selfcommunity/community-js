import {SCUserType} from './user';
import {SCCategoryType} from './category';

/**
 * Interface SCIncubatorType.
 * Incubator Schema.
 */
export interface SCIncubatorType {
  /**
   * The ID of the incubator.
   */
  id: number;

  /**
   * The name of the incubator.
   */
  name: string;

  /**
   * The slug of the incubator.
   */
  slug?: string;

  /**
   * The slogan of the incubator.
   */
  slogan?: string;

  /**
   * Incubator status
   */
  status: number;

  /**
   * Subscribers count
   */
  subscribers_count: number;

  /**
   * Subscribers threshold
   */
  subscribers_threshold: number;

  /**
   * User who proposed the incubator
   */
  user: SCUserType;

  /**
   * Approved incubator
   */
  approved_category?: SCCategoryType;

  /**
   * Added at
   */
  added_at: Date;
  /**
   * If the logged user has subscribed to the incubator
   */
  subscribed: boolean;
}

export interface SCIncubatorSubscriptionType {
  subscribed: boolean;
}
