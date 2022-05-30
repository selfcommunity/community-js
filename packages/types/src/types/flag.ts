import {SCUserType} from './user';

/**
 * SCFlagType interface
 */
export interface SCFlagType {
  /**
   * The user who has been flagged
   */
  user?: SCUserType;
  /**
   * Date time of flag.
   */
  added_at?: Date | string;
  /**
   * Type of flag
   */
  flag_type: SCFlagTypeEnum;
  /**
   * Flag description
   */
  flag_type_description?: string;
}

/**
 * Typology of flags
 */
export enum SCFlagTypeEnum {
  SPAM = 0,
  AGGRESSIVE = 1,
  VULGAR = 2,
  POOR = 3,
  OFFTOPIC = 4
}

export enum SCFlagModerationStatusType {
  IGNORED = 'ignored',
  DELETED = 'deleted',
  HIDDEN = 'hidden'
}
