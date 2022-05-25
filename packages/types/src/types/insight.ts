/**
 * SCInsightType interfaces
 */
import {SCEmbedType} from './embed';
import {SCUserType} from './user';
import {SCFeedObjectType} from './feed';

export interface SCContributionInsightType {
  /**
   * A contribution object (post, discussion or status);
   */
  contribution: SCFeedObjectType;
  /**
   * The score
   */
  score: number;
}

export interface SCEmbedInsightType {
  /**
   * The embed obj.
   */
  embed?: SCEmbedType;
  /**
   * The score
   */
  score?: number;
}

export interface SCUsersInsightType {
  /**
   * The user obj.
   */
  user?: SCUserType;
  /**
   * The score
   */
  score?: number;
}

export interface SCContributionInsightCountersType {
  /**
   * The number of views.
   */
  num_views: number;
  /**
   * The number of comments.
   */
  num_comments: number;
  /**
   * The number of votes.
   */
  num_votes: number;
  /**
   * The number of shares.
   */
  num_shares: number;
}

export interface SCEmbedInsightCountersType {
  /**
   * The number of contributes.
   */
  num_contributes: number;
  /**
   * The number of comments.
   */
  num_comments: number;
  /**
   * The number of votes.
   */
  num_votes: number;
  /**
   * The number of clicks.
   */
  num_clicks: number;
  /**
   * The number of shares.
   */
  num_shares: number;
}

export interface SCUsersInsightCountersType {
  /**
   * The number of contributes.
   */
  num_contributes: number;
  /**
   * The number of comments.
   */
  num_comments: number;
  /**
   * The number of answers received.
   */
  num_answers_received: number;
  /**
   * The number of comments received.
   */
  num_comments_received: number;
  /**
   * The number of votes.
   */
  num_votes: number;
  /**
   * The number of votes received.
   */
  num_votes_received: number;
  /**
   * The number of connections
   */
  num_connections: number;
  /**
   * The number of followings
   */
  num_followings: number;
  /**
   * The number of followers
   */
  num_followers: number;
  /**
   * The number of shares
   */
  num_shares: number;
  /**
   * The number of posts visits
   */
  num_posts_visits: number;
  /**
   * The number of custom embed click received
   */
  num_embed_custom_click_received: number;
}
