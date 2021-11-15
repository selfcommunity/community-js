/**
 * Interface SCCommentType.
 * Comment Schema.
 */
import {SCUserType} from '@selfcommunity/core';

export interface SCCommentType {
  /**
   * Id of the comment
   */
  id: number;

  /**
   * Id of the Discussion object
   */
  discussion?: number;

  /**
   * Id of the Post object
   */
  post?: number;

  /**
   * Id of the Status object
   */
  status?: number;

  /**
   * User who commented
   */
  author?: SCUserType;

  /**
   * Added at
   */
  added_at: Date;

  /**
   * Html of the comment
   */
  html: string;

  /**
   * Summary
   */
  summary: string;

  /**
   * If the comments is deleted
   */
  deleted: boolean;

  /**
   * If the comments is hidden
   */
  collapsed: boolean;

  /**
   * Id of the parent
   */
  parent: number;

  /**
   * Id of the reply Comment, it must have the same parent
   */
  in_reply_to?: number;

  /**
   * Number of votes
   */
  vote_count: number;

  /**
   * True if the logged user has already voted the comment
   */
  voted: boolean;

  /**
   * Number of flags
   */
  flag_count: number;

  /**
   * Number of comments
   */
  comment_count: number;

  /**
   * Text of the comment
   */
  text: string;

  /**
   * Comments childs
   */
  latest_comments?: SCCommentType[];
}
