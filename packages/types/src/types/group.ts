/**
 * Interface SCGroupType.
 * Group Schema.
 */
import {SCUserType} from './user';

/**
 * SCGroupPrivacyType enum
 */
export enum SCGroupPrivacyType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

/**
 * SCGroupSubscriptionStatusType enum
 */
export enum SCGroupSubscriptionStatusType {
  SUBSCRIBED = 'subscribed',
  REQUESTED = 'requested',
  INVITED = 'invited'
}

export interface SCGroupType {
  /**
   * The ID of the group.
   */
  id: number;

  /**
   * The name of the group.
   */
  name: string;

  /**
   * The description of the group.
   */
  description: string;

  /**
   * The slug for the group.
   */
  slug: string;

  /**
   * The color of the group.
   */
  color: string;

  /**
   * The group privacy.
   */
  privacy: SCGroupPrivacyType;

  /**
   * The group visibility.
   */
  visible: boolean;

  /**
   * The group actie status.
   */
  active: boolean;

  /**
   * The group subscription status.
   */
  subscription_status: SCGroupSubscriptionStatusType;

  /**
   * The group subscription status.
   */
  subscribed: boolean;

  /**
   * The group image, bigger format.
   */
  image_bigger: string;

  /**
   * The group image, big format.
   */
  image_big: string;

  /**
   * The group image, medium format.
   */
  image_medium: string;

  /**
   * The group image, small format.
   */
  image_small: string;

  /**
   * The group emotional image.
   */
  emotional_image: string;

  /**
   * The group emotional image position.
   */
  emotional_image_position: number;

  /**
   * The group creation date.
   */
  created_at: string;

  /**
   * The group creator.
   */
  created_by: SCUserType;

  /**
   * The group admin.
   */
  managed_by: SCUserType;
  /**
   * The number of group members
   */
  subscribers_counter: number;
}
