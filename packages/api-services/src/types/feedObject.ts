import {BaseGetParams} from './baseParams';
import {SCContributionLocation, SCPollType} from '@selfcommunity/types/src/types';
/**
 * FeedObjGetParams interface
 */
export interface FeedObjGetParams extends BaseGetParams {
  /**
   * Which field to use when ordering the results. For sorting desc use - in front of the field name. Default to -added_at. Available values are added_at, last_activity_at
   */
  ordering?: string;
}

export interface FeedObjCreateParams {
  /**
   * The title of the feed obj (type discussion or post).
   */
  title: string;
  /**
   * This field replaces title field  for feed objs of type 'status'.
   */
  action?: string;
  /**
   * The content of the feed obj in html format, it can contain some mentions.
   */
  text?: string;
  /**
   * List of category ids
   */
  categories: number[];
  /**
   * List o media ids
   */
  medias?: number[];
  /**
   * 	The Locality object to associate to the feed obj.
   */
  location: SCContributionLocation;
  /**
   * The poll to associate to the feed obj.
   * IMPORTANT: it can be used only for feed obj types: 'discussion' or 'post'.
   */
  poll?: SCPollType | null;
  /**
   * The list of tag ids.
   */
  addressing?: number[];
}

/**
 * FeedObjectPollVotesSearch interface
 */
export interface FeedObjectPollVotesSearch extends BaseGetParams {
  /**
   * The choice id of the poll. If is specified the endpoint retrieves the votes of only that choice
   */
  choice?: number;
}
