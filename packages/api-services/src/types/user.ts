/**
 * UserAutocompleteParams interface.
 */
import {BaseGetParams, BaseSearchParams} from './baseParams';

export interface UserAutocompleteParams extends BaseSearchParams {
  /**
   *	Filter using field username.
   */
  username?: string;
  /**
   * Filter using field gender type.
   */
  gender?: string;
  /**
   * Filter using field real_name.
   */
  real_name?: string;
  /**
   * Filter using field location.
   */
  location?: string;
  /**
   * Filter using field description.
   */
  description?: string;
  /**
   * Ordering fields (eg?: ?ordering=username). Minus char is used for descending ordering, eg. -username
   */
  ordering?: string;
}

/**
 * UserScoreParams interface.
 */
export interface UserScoreParams {
  /**
   * A comment about this operation (only for internal usage).
   */
  comment?: string;
  /**
   * Positive or negative integer value.
   */
  score: number;
  /**
   * A unique integer value identifying the user
   */
  user: number;
}

/**
 * UserSearchParams interface.
 */
export interface UserSearchParams extends BaseGetParams {
  /**
   * A search term. Search in fields: username, real_name. If this parameter is used username & real_name will be ignored.
   */
  user?: string;
  /**
   *	Filter using field username.
   */
  username?: string;
  /**
   * Filter using field real_name.
   */
  real_name?: string;
  /**
   * Filter using field gender type.
   */
  gender?: string;
  /**
   * Filter using field location.
   */
  location?: string;
  /**
   * 	Filter using age ranges. Possible values: -30, 30-45, 45+. The value 45+ must be encoded in the request url: 45%2B.
   */
  age?: string;
  /**
   * Filter using coordinates lat,lng.
   */
  lat_lng?: string;
  /**
   * Use the coordinates (position_lat_lng or location_lat_lng) of the authenticated user.
   */
  user_position?: string;
  /**
   * Filter using field description.
   */
  description?: string;
  /**
   *Filter the users that belong to the staff.
   */
  is_staff?: boolean;
  /**
   * Ordering fields (eg?: ?ordering=username). Minus char is used for descending ordering, eg. -username.
   */
  ordering?: string;
  /**
   * Filter using tag ID.
   */
  tag?: number;
  /**
   * 	Filter using category ID.
   */
  category?: number;
}

export interface DeleteProviderAssociation {
  /**
   * The user id of the association
   */
  user_id: number | string;
  /**
   * The provider of the provider association
   */
  provider: string;
  /**
   * The external id of the user in the provider platform
   */
  ext_id: string;
}
