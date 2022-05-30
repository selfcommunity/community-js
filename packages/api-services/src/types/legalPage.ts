import {BaseSearchParams} from './baseParams';

/**
 * LegalPageFilterParams interface.
 */
export interface LegalPageFilterParams extends BaseSearchParams {
  /**
   * Valid from date
   */
  valid_from: string;
  /**
   * Valid to date
   */
  valid_to: string;
  /**
   * Which field to use when ordering the results
   */
  ordering: string;
}
