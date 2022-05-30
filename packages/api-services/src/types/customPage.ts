import {BaseGetParams} from './baseParams';

/**
 * CustomPageParams interface
 */
export interface CustomPageParams extends BaseGetParams {
  /**
   * Filter using field active (only if user is administrator or editor).
   */
  active?: boolean;
  /**
   *  	Filter using field visible_in_menu.
   */
  visible_in_menu?: string;
}
/**
 * CustomPageSearchParams interface
 */
export interface CustomPageSearchParams extends CustomPageParams {
  /**
   * 	A search term.
   */
  search?: string;
}
