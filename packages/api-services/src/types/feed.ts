import {BaseGetParams} from './baseParams';

export interface FeedParams extends BaseGetParams {
  /**
   * The ordering of the feed. Default to home_stream_order_by community option.
   * Other values:
   * 'recent'
   * 'last_activity'
   */
  ordering?: string;
}
