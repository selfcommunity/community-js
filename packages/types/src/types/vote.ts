import {SCUserType} from './user';
/**
 * SCVoteType interface
 */

export interface SCVoteType {
  /**
   * The user who voted.
   */
  user?: SCUserType;
  /**
   * Date time of vote.
   */
  voted_at?: Date | string;
}
