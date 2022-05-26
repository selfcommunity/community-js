import {SCContributionType, SCFlagTypeEnum} from '@selfcommunity/types/src/types';

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
  user: number;
  /**
   * An integer value to describe the moderation activity if action is one between scold_author, hide or delete. This param is not needed if the contribute is already hidden or deleted (you are restoring).
   */
  moderation_type: SCFlagTypeEnum;
}
