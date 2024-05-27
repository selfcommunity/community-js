import {SCUserType} from './user';
import {SCCategoryType} from './category';
import {SCContributionLocation} from './location';
import {SCPollType} from './poll';
import {SCMediaType} from './media';
import {SCTagType} from './tag';
import {SCReactionType} from './reaction';
import {SCContributionType} from './contribution';
import {SCGroupType} from './group';

/**
 * Typology of feed
 */
export enum SCFeedTypologyType {
  HOME = 'home',
  EXPLORE = 'explore',
  CATEGORY = 'category',
  GROUP = 'group'
}

/**
 * Interface SCFeedUnitType.
 * FeedUnit Schema.
 */
export interface SCFeedUnitType {
  /**
   * The type of the object, can be discussion, post or status
   */
  type: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Discussion object
   */
  discussion?: SCFeedDiscussionType;

  /**
   * Post object
   */
  post?: SCFeedPostType;

  /**
   * Status object
   */
  status?: SCFeedStatusType;

  /**
   * Id of User that have seen this object
   */
  seen_by_id?: number[];

  /**
   * True if this object has the visibility boost
   */
  has_boost?: boolean;

  /**
   * List of feed activities. This field is returned only for relevance feed
   */
  activities?: SCFeedUnitActivityType[];
}

export enum SCFeedUnitActivityTypologyType {
  COMMENT = 'comment',
  VOTE = 'vote',
  POLLVOTE = 'pollvote',
  FOLLOW = 'follow'
}

/**
 * Interface SCFeedUnitActivityType.
 * FeedUnit Activity Schema.
 */
export interface SCFeedUnitActivityType {
  /**
   * The type of the activity.
   */
  type: SCFeedUnitActivityTypologyType;

  /**
   * The comment if type ==  SCFeedUnitActivityTypologyType.COMMENT.
   */
  comment?: any;

  /**
   * The user involved.
   */
  author: SCUserType;

  /**
   * Time of activity
   */
  active_at: Date;

  /**
   * Id of Users that have seen this activity
   */
  seen_by_id?: number[];
}

/**
 * Interface SCFeedObjectType.
 * FeedObject Schema.
 * General object.
 */
export interface SCFeedObjectType {
  /**
   * The ID of the post.
   */
  id: number;

  /**
   * List of categories.
   */
  categories?: SCCategoryType[];
  /**
   * The id of the group.
   */
  group?: SCGroupType;

  /**
   * List of medias
   */
  medias?: SCMediaType[];

  /**
   * Location (contribution geolocation)
   */
  location?: SCContributionLocation;

  /**
   * Author of the contribute
   */
  author?: SCUserType;

  /**
   * Last activity at
   */
  last_activity_at: Date;

  /**
   * Added at
   */
  added_at: Date;

  /**
   * Slug
   */
  slug: string;

  /**
   * Html
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
   * True if the object is deleted
   */
  deleted: boolean;

  /**
   * True if the object is hidden
   */
  collapsed: boolean;

  /**
   * Number of comment
   */
  comment_count: number;

  /**
   * Number of internal share
   */
  share_count: number;

  /**
   * True if the logged user follow this object
   */
  followed?: boolean;

  /**
   * Number of views
   */
  view_count: number;
  /**
   * Number of votes
   */
  vote_count: number;
  /**
   * Number of followers
   */
  follower_count: number;
  /**
   * Reaction obj
   */
  reaction: SCReactionType;
  /**
   * Reactions number and objs
   */
  reactions_count: any[];
  /**
   * True if the logged user has already voted this object
   */
  voted?: boolean;

  /**
   * Number of flags
   */
  flag_count: number;

  /**
   * Tags adderssing
   */
  addressing: SCTagType[];

  /**
   * Type: discussion, post, status
   */
  type: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Suspended notification
   */
  suspended?: boolean;
}

/**
 * Interface SCFeedDiscussionType.
 * FeedDiscussion Schema.
 */
export interface SCFeedDiscussionType extends SCFeedObjectType {
  /**
   * Title of the discussion
   */
  title: string;

  /**
   * Poll
   */
  poll?: SCPollType;
}

/**
 * Interface SCFeedPostType.
 * Post Schema.
 */
export interface SCFeedPostType extends SCFeedObjectType {
  /**
   * Poll
   */
  poll?: SCPollType;
}

/**
 * Interface SCFeedStatusType.
 * Status Schema.
 */
export type SCFeedStatusType = SCFeedObjectType;

/**
 * SCFeedUnseenCountType interface
 */

export interface SCFeedUnseenCountType {
  count_by_category?: SCCountByCategoryType[];
  total: number;
}

export interface SCCountByCategoryType {
  id: number;
  count: number;
}

/**
 * Feed Object suspended status
 */
export interface SCFeedObjectSuspendedStatusType {
  suspended: boolean;
}

/**
 * Feed Object following status
 */
export interface SCFeedObjectFollowingStatusType {
  following: boolean;
}
/**
 * Feed Object hide status
 */
export interface SCFeedObjectHideStatusType {
  hidden: boolean;
}
