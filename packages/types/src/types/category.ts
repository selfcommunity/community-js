import {SCTagType} from './tag';

/**
 * Interface SCCategoryType.
 * Category Schema.
 */
export interface SCCategoryType {
  /**
   * The ID of the category.
   */
  id: number;

  /**
   * The manual ordering number of the category.
   */
  order?: number;

  /**
   * The name of the category.
   */
  name: string;

  /**
   * The synonyms/aliases of the category.
   */
  name_synonyms?: string;

  /**
   * The slug of the category.
   */
  slug?: string;

  /**
   * The slogan of the category.
   */
  slogan?: string;

  /**
   * The category's html text.
   */
  html_info?: string;

  /**
   * The category's html meta tag.
   */
  seo_title?: string;

  /**
   * The description for category's html meta tag.
   */
  seo_description?: string;

  /**
   * The category's auto follow behaviour.
   */
  auto_follow?: string;

  /**
   * The category status.
   */
  active?: boolean;

  /**
   * The category status.
   */
  deleted?: boolean;

  /**
   * The category's image with min size.
   */
  image_original?: string;

  /**
   * The category's auto generated bigger size.
   */
  image_bigger?: string;

  /**
   * The category's auto generated big size.
   */
  image_big?: string;

  /**
   * The category's auto generated medium size.
   */
  image_medium?: string;

  /**
   * The category's auto generated small size.
   */
  image_small?: string;

  /**
   * The landscape format image for category hub.
   */
  emotional_image_original?: string;

  /**
   * The css background-position.
   */
  emotional_image_position?: number;

  /**
   * The last modify (datetime)
   */
  lastmod_datetime?: string;

  /**
   * The order of the category feed.
   */
  stream_order_by?: string;

  /**
   * The category's tags.
   */
  tags?: Array<SCTagType>;
  /**
   * Followers counter for the category.
   */
  followers_counter?: number;
}

export interface SCCategoryAudienceType {
  category_audience: number;
  connections_audience: number;
}

export interface SCCategoryFollowedStatusType {
  is_followed: boolean;
}
