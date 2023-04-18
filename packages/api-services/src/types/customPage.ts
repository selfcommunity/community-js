import {BaseGetParams, BaseSearchParams} from './baseParams';

/**
 * CustomPageParams interface
 */
export interface CustomPageParams extends BaseGetParams {
  /**
   * Filter using field active (only if user is administrator or editor).
   */
  active?: boolean;
}
/**
 * CustomPageSearchParams interface
 */
export interface CustomPageSearchParams extends CustomPageParams, BaseSearchParams {}
