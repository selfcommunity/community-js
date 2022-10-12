import {SCUserType} from './user';
import {SCReactionType} from './reaction';
/**
 * SCVoteType interface
 */

export interface SCVoteType {
  /**
   * The user who voted.
   */
  user?: SCUserType;
  /**
   * The reaction used.
   */
  reaction?: SCReactionType;
  /**
   * Date time of vote.
   */
  voted_at?: Date | string;
}
