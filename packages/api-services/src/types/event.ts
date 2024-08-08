/**
 * EventCreateParams interface
 */
import {SCEventPrivacyType, SCEventRecurrenceType} from '@selfcommunity/types';
import {BaseGetParams} from './baseParams';
import {SCEventLocationType} from '@selfcommunity/types/src/types/event';

export interface EventCreateParams {
  /**
   * A unique name for the group
   */
  name: string;
  /**
   * The group privacy
   */
  privacy: SCEventPrivacyType;
  /**
   * The group visibility. It is required when privacy = private.
   */
  visible?: boolean;
  /**
   * The group description
   */
  description?: string;
  /**
   * The event starting date and time
   */
  start_date: string;
  /**
   * The group ending date and time
   */
  end_date?: string;
  /**
   * The users to invite to the group
   */
  invite_users?: number[];
  /**
   * The event image
   */
  image_original?: File;
  /**
   * The event location
   */
  location: SCEventLocationType;
  /**
   * The event exact point
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
   * The event recurrency
   */
  recurring?: SCEventRecurrenceType;
}

/**
 * EventFeedParams interface.
 */
export interface EventFeedParams extends BaseGetParams {
  /**
   * Which field to use when ordering the results.
   */
  ordering?: string;
}
