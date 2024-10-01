/**
 * EventCreateParams interface
 */
import {SCEventDateFilterType, SCEventPrivacyType, SCEventRecurrenceType, SCEventSubscriptionStatusType} from '@selfcommunity/types';
import {BaseGetParams, BaseSearchParams} from './baseParams';
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

/**
 * EventRelatedParams interface.
 */
export interface EventRelatedParams extends BaseGetParams {
  /**
   * Filter results by created_by user id.
   */
  created_by?: number;
}

/**
 * EventUserParams interface.
 */
export interface EventUserParams extends BaseGetParams {
  /**
   * Filter results by subscription_status
   */
  subscription_status?: SCEventSubscriptionStatusType;
  /**
   *  Filtered past events
   */
  past?: boolean | number;
	/**
	 * Filtered location
	 */
	location?: SCEventLocationType;
}

/**
 * EventFeedParams interface.
 */
export interface EventSearchParams extends BaseSearchParams {
  /**
   * The events filtered by a specific time frame
   */
  date_filter?: SCEventDateFilterType;
  /**
   * The events created or followed by the users followed
   */
  follows?: boolean | number;
  /**
   * Filtered past events
   */
  past?: boolean | number;
  /**
   * Filtered location
   */
  location?: SCEventLocationType;
}
