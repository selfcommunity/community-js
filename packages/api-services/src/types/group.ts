/**
 * GroupCreateParams interface
 */
import {SCGroupPrivacyType, SCIncubatorStatusType} from '@selfcommunity/types';
import {BaseGetParams, BaseSearchParams} from './baseParams';

export interface GroupCreateParams {
  /**
   * A unique name for the group
   */
  name: string;
  /**
   * The group privacy
   */
  privacy: SCGroupPrivacyType;
  /**
   * The group visibility. It is required when privacy = private.
   */
  visible?: boolean;
  /**
   * The group description
   */
  description?: string;
  /**
   * The users to invite to the group
   */
  invite_users?: number[];
}

/**
 * GroupFeedParams interface.
 */
export interface GroupFeedParams extends BaseGetParams {
  /**
   * Which field to use when ordering the results.
   */
  ordering?: string;
}
