import {SCUserType} from './user';
import {SCCategoryType} from './category';

/**
 * Interface SCIncubatorType.
 * Category Schema.
 */
export interface SCIncubatorType {
  /**
   * The ID of the category.
   */
  id: number;

  /**
   * The name of the category.
   */
  name: string;

  /**
   * The slug of the category.
   */
  slug?: string;

  /**
   * The slogan of the category.
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
   * Approved category
   */
  approved_category?: SCCategoryType;

  /**
   * Added at
   */
  added_at: Date;
  /**
   * If the logged user has subscribed to the incubator
   */
  subscribed?: boolean;
}
