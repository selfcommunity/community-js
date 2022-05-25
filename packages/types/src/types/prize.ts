import {SCUserType} from './user';

/**
 * Interface SCPrizeType.
 * Prize Schema.
 */
export interface SCPrizeType {
  /**
   * The ID of the prize.
   */
  id: number;

  /**
   * The active status of the prize.
   */
  active?: boolean;

  /**
   * The title of the prize.
   */
  title?: string;

  /**
   * The prize description.
   */
  description?: string;
  /**
   * Points to request the prize.
   */
  points?: number;

  /**
   * Date of prize creation.
   */
  created_at?: Date;
  /**
   * Date of last modify.
   */
  lastmod_datetime?: Date;
  /**
   * The prize creator.
   */
  created_by?: SCUserType;

  /**
   * The prize image.
   */
  image?: string;
  /**
   * Link to a web resource for the prize.
   */
  link?: string;
}

/**
 * SCPrizeUserType interface
 * Loyalty Prize User Schema
 */

export interface SCPrizeUserType {
  /**
   * Unique integer value
   */
  id: number;
  /**
   * User obj
   */
  user: SCUserType;
  /**
   * Prize obj.
   */
  prize: SCPrizeType;
  /**
   * Prize points when the request was created
   */
  prize_points: number;
  /**
   * Date since it was in pending status.
   */
  pending_at: Date | string;
  /**
   * Integer value representing the status.
   */
  status: SCPrizeUserStatusType;
  /**
   * The string representation of the status.
   */
  status_description: string;
}

export enum SCPrizeUserStatusType {
  PENDING = 0,
  REFUSED = 1,
  SENT = 2
}
