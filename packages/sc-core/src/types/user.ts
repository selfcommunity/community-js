/**
 * Interface SCUserType.
 * User Schema.
 */
import {SCTagType} from './tag';

/**
 * User Fields
 */
export enum SCUserFields {
  REAL_NAME = 'real_name',
  DATE_JOINED = 'date_joined',
  BIO = 'bio',
  LOCATION = 'location',
  DATE_OF_BIRTH = 'date_of_birth',
  DESCRIPTION = 'description',
  GENDER = 'gender',
  WEBSITE = 'website',
}

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

  /**
   *  User roles
   */
  role: string[];

  /**
   * interactions counter
   */
  unseen_interactions_counter?: number;

  /**
   * notification banner counter
   */
  unseen_notification_banners_counter?: number;
}

/**
 * User Settings
 */
export interface SCUserSettingsType {
  /**
   * Frequency of the email notifications for all interactions (except for private messages notifications)
   */
  qa_frequency: number;

  /**
   * Enable private messages notifications also via mail
   */
  email_notification_not_qa: number;

  /**
   * Enable mobile app/PWA notifications
   */
  mobile_notifications_scmty: number;

  /**
   * Shows a popup when the user receive a notification
   */
  show_toast_notifications: number;

  /**
   * Emit a sound when the notification popup is shown. See 'show_toast_notifications'
   */
  toast_notifications_emit_sound: number;
}


/**
 * User Blocked Settings
 */
export interface SCUserBlockedSettingsType {
  /**
   * N° days of block
   */
  days_blocked: number;

  /**
   * Reputation stolen
   */
  reputation_delta: number;

  /**
   * Start User Block datetime
   */
  blocked_at?: Date;

  /**
   * End User Block datetime
   */
  expire_at?: Date;
}
