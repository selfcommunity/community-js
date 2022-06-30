import {SCFlagModerationStatusType, SCFlagTypeEnum} from './flag';
import {SCUserType} from './user';
import {SCFeedObjectType} from './feed';
import {SCCommentType} from './comment';

/**
 * SCFlaggedContributionType
 */
export interface SCFlaggedContributionType {
  /**
   * The feed obj type(discussion, post, status)
   */
  contribution_type: SCContributionType;
  /**
   * The feed obj
   */
  contribution: SCFeedObjectType | SCCommentType;
  /**
   * Date time of the last flag
   */
  last_flagged_at: Date | string;
  /**
   * Moderation status
   */
  moderation_status: SCFlagModerationStatusType;
  /**
   * Cause of the moderation
   */
  moderation_type: SCFlagTypeEnum;
  /**
   * The moderator
   */
  moderation_by: SCUserType;
  /**
   * Date time of the moderation
   */
  moderation_at: Date | string;
}

/**
 * Contribute types
 */
export enum SCContributionType {
  DISCUSSION = 'discussion',
  POST = 'post',
  STATUS = 'status',
  COMMENT = 'comment'
}

/**
 *
 */
export interface SCContributionStatus {
  status: SCContributeStatusType;
  flag_type: SCFlagTypeEnum;
  flag_type_description: string;
}

/**
 * Contribute status types
 */
export enum SCContributeStatusType {
  OPEN = 'open',
  IGNORED = 'ignored',
  HIDDEN = 'hidden',
  DELETED = 'deleted'
}
