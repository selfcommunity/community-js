import {BaseGetParams} from './baseParams';
import {SCContributionType} from '@selfcommunity/types';

/**
 * Interface InsightParams
 */
export interface InsightCommonParams extends BaseGetParams {
  /**
   * Can be a single category id or list (comma separated) of categories ids. 0 means empty (no category). If you use a list of category ids then any contribution that matches at least one category_id will be returned (the filter is in OR and not in AND).
   */
  category_id?: string;
  /**
   *  Datetime of creation(greater than or equal to the given value).
   */
  created_at__gte?: string;
  /**
   * Datetime of creation(less than or equal to the given value).
   */
  created_at__lte?: string;
  /**
   * The rank value to use: num_votes, num_comments, num_shares, num_views (default: rank function). If a list (eg: num_comments, num_answers_received) the final rank will be the sum of the list components.
   */
  ranked_by?: number;
  /**
   * 	The embed id (required in combo with embed_type).
   */
  embed_id?: number;
  /**
   * 	The embed type (required in combo with embed_id).
   */
  embed_type?: string;
}

/**
 * Interface InsightContributionParam
 */
export interface InsightContributionParams extends InsightCommonParams {
  /**
   * The user id.
   */
  user_id?: number;
  /**
   * The contribution type (discussion, post, status).
   */
  contribution_type?: Exclude<SCContributionType, SCContributionType.COMMENT>;
}

/**
 * Interface InsightEmbedParams
 */
export interface InsightEmbedParams extends InsightCommonParams {
  /**
   * embed_id, embed_type or metadata TERM_KEY.
   */
  grouped_by?: string;
  /**
   * A json dict containing some TERM_KEYs (eg: {"authors": ["Umberto Eco", "Neil Gaiman"], "type": "book"}). Usable only if group_by is set.
   */
  metadata?: {};
}

/**
 * Interface InsightUserParams
 */
export interface InsightUserParams extends InsightCommonParams {
  /**
   * Can be a single user tag id or list (comma separated) of user tag ids. If you use a list of ids then any user who matches at least one id will be returned (the filter is in OR and not in AND).
   */
  user_tag_id?: number;
}
