import {SCUserType} from '@selfcommunity/core';

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
