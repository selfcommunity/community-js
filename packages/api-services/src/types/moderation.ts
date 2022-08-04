import {SCContributionType, SCFlagTypeEnum} from '@selfcommunity/types/src/types';
import {BaseGetParams, BaseSearchParams} from './baseParams';

/**
 * ModerationParams
 */

export interface ModerationParams extends BaseSearchParams {
  /**
   * "days" or "forever"
   */
  days_blocked?: string;
  /**
   * Default ordering is: -date_joined. Other valid fields are: expire_at, blocked_at
   */
  order_by?: string;
}
/**
 * ModerateContributionParams interface
 */
export interface ModerateContributionParams {
  /**
   * Valid values are: post, discussion, comment
   */
  contribution_type: SCContributionType;
  /**
   * Valid values are: scold_author, scold_flagger, ignore, hide, delete
   */
  action: string;
  /**
   * The user id of the contribution flagger to scold (use only with action=scold_flagger)
   */
  user?: number;
  /**
   * An integer value to describe the moderation activity if action is one between scold_author, hide or delete. This param is not needed if the contribute is already hidden or deleted (you are restoring).
   */
  moderation_type: SCFlagTypeEnum;
}

/**
 * FlaggedContributionParams interface
 */
export interface FlaggedContributionParams extends BaseGetParams {
  /**
   * Minimum number of flags received by a contribute to display it in this list.
   */
  min_flags?: number;
  /**
   * Valid values are: post, discussion, status, comment
   */
  contribution_type?: string;
  /**
   * A unique integer value identifying this Contribution.
   */
  contribution_id?: number;
  /**
   * Username (or part of it) of the contributes' author
   */
  author?: string;
  /**
   * Username (or part of it) of the contributes' flagger
   */
  flagged_by?: string;
  /**
   * Content text (or part of it) of the contributes
   */
  content?: string;
  /**
   * Moderation status of the contributes flagged
   */
  moderation_status?: string;
  /**
   * Default ordering is: -last_flagged_at. Other valid fields are: flag_count, last_moderated_at
   */
  order_by?: string;
}
