/**
 * Interface SCGroupEventType.
 * Event Schema.
 */
import {SCUserType} from './user';

/**
 * SCEventPrivacyType enum
 */
export enum SCEventPrivacyType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

/**
 * SCEventLocationType enum
 */
export enum SCEventLocationType {
  PERSON = 'in person',
  ONLINE = 'virtual'
}

/**
 * SCEventRecurrenceType enum
 */
export enum SCEventRecurrenceType {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface SCEventType {
  /**
   * The ID of the event.
   */
  id: number;

  /**
   * The name of the event.
   */
  name: string;

  /**
   * The description of the event.
   */
  description: string;

  /**
   * The slug for the event.
   */
  slug: string;

  /**
   * The color of the event.
   */
  color: string;

  /**
   * The event privacy.
   */
  privacy: SCEventPrivacyType;

  /**
   * The event visibility.
   */
  visible: boolean;

  /**
   * The event active status.
   */
  active: boolean;

  /**
   * If the event is showed in the feed.
   */
  show_on_feed: boolean;

  /**
   * The event subscription status.
   */
  subscription_status: boolean;

  /**
   * The event image, bigger format.
   */
  image_bigger: string;

  /**
   * The event image, big format.
   */
  image_big: string;

  /**
   * The event image, medium format.
   */
  image_medium: string;

  /**
   * The event image, small format.
   */
  image_small: string;

  /**
   * The event emotional image.
   */
  emotional_image: string;

  /**
   * The event emotional image position.
   */
  emotional_image_position: number;

  /**
   * The number of event members
   */
  subscribers_counter: number;

  /**
   * The number of participating members
   */
  goings_counter: number;

  /**
   * The event start date.
   */
  start_date: string;

  /**
   * The event end date.
   */
  end_date: string;

  /**
   * The event recurrence
   */
  recurring: SCEventRecurrenceType;

  /**
   * The event location (in person, online)
   */
  location: SCEventLocationType;

  /**
   * The event place
   */
  geolocation: string;

  /**
   * The event latitude
   */
  geolocation_lat: number;

  /**
   * The event longitude
   */
  geolocation_lng: number;

  /**
   * The event link(if virtual)
   */

  link: string | null;

  /**
   * The event creation date.
   */
  created_at: string;

  /**
   * The event creator.
   */
  created_by: SCUserType;

  /**
   * The event admin.
   */
  managed_by: SCUserType;
}
