import {SCUserType} from './user';
import {SCReactionType} from './reaction';
import { SCGroupType } from './group';

/**
 * Interface SCCommentType.
 * Comment Schema.
 */
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
   * Summary html
   */
  summary_html?: string;

  /**
   * True if summary_html is truncated
   */
  summary_truncated?: boolean;

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

  /**
   * Type: comment
   */
  type: string;

  /**
   * Reactions number and objs
   */
  reactions_count: [];

  /**
   * Reaction obj
   */
  reaction: SCReactionType;
  /**
   * The group obj
   */
  group?: SCGroupType;
}

/**
 * Type of comments ordering
 */
export enum SCCommentsOrderBy {
  ADDED_AT_DESC = '-added_at',
  ADDED_AT_ASC = 'added_at',
  CONNECTION_DESC = '-connection',
  CONNECTION_ASC = 'connection'
}
