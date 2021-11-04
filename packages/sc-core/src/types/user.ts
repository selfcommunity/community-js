/**
 * Interface SCUserType.
 * User Schema.
 */
import {SCTagType} from './tag';

export interface SCUserType {
  /**
   * The ID of the user.
   */
  id: number;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * Real name of the user.
   */
  real_name: string;

  /**
   * Email of the user.
   */
  email?: string;

  /**
   * Email is valid. Default: False.
   */
  email_isvalid?: boolean;

  /**
   * Date joined to the community.
   */
  date_joined: Date;

  /**
   * User biography.
   */
  bio: string;

  /**
   * Location
   */
  location: string;

  /**
   * Location in coordinates. Format: lat,lng.
   */
  location_lat_lng?: string;

  /**
   * User current position. Format: lat,lng.
   */
  position_lat_lng?: string;

  /**
   * Date of birth. Format: YYYY-MM-DD (ISO 8601).
   */
  date_of_birth?: Date;

  /**
   * User description.
   */
  description: string;

  /**
   * Gender of the user. Values: Male, Female, Unspecified. Default: Unspecified.
   */
  gender: string;

  /**
   * User status. Values: a (approved), b (blocked), d (deleted; soft deleted), u (unregistered). Default: a.
   */
  status: string;

  /**
   * User website.
   */
  website: string;

  /**
   * Avatar of the user.
   */
  avatar: string;

  /**
   * Image Cover of the user.
   */
  cover?: string;

  /**
   * The external ID of the user. It is assigned only during signup if necessary.
   */
  ext_id?: number;

  /**
   * User's tag list. List of Tag.
   */
  tags: Array<SCTagType>;

  /**
   * User reputation.
   */
  reputation: number;

  /**
   * List of user permission. Only for the resource /user/me/.
   */
  permission?: Array<string>;

  /**
   * The connection status between the request user and this user.
   */
  connection_status?: string;

  /**
   * Number of connection requests sent by the user.
   */
  connection_requests_sent_counter?: number;

  /**
   * Number of connection requests received by the user.
   */
  connection_requests_received_counter?: number;

  /**
   * Number of connections of the user.
   */
  connections_counter?: number;

  /**
   * Number of followings of the user
   */
  followings_counter?: number;

  /**
   * Number of followers of the user
   */
  followers_counter?: number;

  /**
   * Number of posts created by the user.
   */
  posts_counter?: number;

  /**
   * Number of discussions created by the user.
   */
  discussions_counter?: number;

  /**
   * Number of statuses created by the user.
   */
  statuses_counter?: number;

  /**
   * Number of polls created by the user.
   */
  polls_counter?: number;
}
