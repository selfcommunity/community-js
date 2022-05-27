import {SCUserType} from '@selfcommunity/types/';
import {BaseGetParams} from './baseParams';
/**
 * Interface Comment
 */
export interface CommentListParams extends BaseGetParams {
  /**
   * Id of the Discussion, required if both post, status and user parameters are not set
   */
  discussion: number;
  /**
   * 	Id of the Post, required if both discussion, status and user parameters are not set
   */
  post?: number;
  /**
   * Id of the Status, required if both discussion, post and user parameters are not set
   */
  status?: number;
  /**
   * 	Id of the User, required if both discussion, post and status parameters are not set
   */
  user?: SCUserType;
  /**
   * 	Id of the parent Comment, used for retrieve nested comments
   */
  parent?: string;
  /**
   * 	The field for sorting use - for order desc. Default to added_at
   */
  ordering: string;
}

export interface CommentCreateParams {
  discussion: number;
  /**
   * 	Id of the Post, required if both discussion, status and user parameters are not set
   */
  post?: number;
  /**
   * Id of the Status, required if both discussion, post and user parameters are not set
   */
  status?: number;
  /**
   * 	Id of the parent Comment, used for retrieve nested comments
   */
  parent?: string;
  /**
   * 		text for the Comment, html format, it can contain some mentions
   */
  text: string;
}
