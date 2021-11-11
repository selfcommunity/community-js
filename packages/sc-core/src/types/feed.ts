import {SCUserType} from './user';
import {SCCategoryType} from './category';
import {SCContributeLocation} from './location';
import {SCPollType} from './poll';
import {SCMediaType} from './media';

/**
 * Interface SCFeedUnitType.
 * FeedUnit Schema.
 */
export interface SCFeedUnitType {
  /**
   * The type of the object, can be discussion, post or status
   */
  type: string;

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

/**
 * Interface SCFeedUnitActivityType.
 * FeedUnit Activity Schema.
 */
export interface SCFeedUnitActivityType {
  /**
   * The ID of the post.
   */
  type: string;
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
  categories: SCCategoryType[];

  /**
   * List of medias
   */
  medias?: SCMediaType[];

  /**
   * Location (contribute geolocation)
   */
  location?: SCContributeLocation;

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
   * Number of votes
   */
  vote_count: number;

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
  addressing: number[];
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
