/**
 * IncubatorCreateParams interface
 */
import {BaseSearchParams} from './baseParams';
import {SCIncubatorStatusType} from '@selfcommunity/types/src/types';

export interface IncubatorCreateParams {
  /**
   * A unique name for the incubator
   */
  name: string;
  /**
   * 	A unique slug (url valid string) for the incubator
   */
  slug?: string;
  /**
   * 	A short text for the incubator
   */
  slogan?: string;
}

/**
 * IncubatorSearchParams interface.
 */
export interface IncubatorSearchParams extends BaseSearchParams {
  /**
   * Valid values are from 0 to 3
   */
  status?: SCIncubatorStatusType;
  /**
   * Which field to use when ordering the results.
   */
  ordering?: string;
}
