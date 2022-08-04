/**
 * BaseGetParams interface
 */

export interface BaseGetParams {
  /**
   *	Number of results to return per page.
   */
  limit?: number;
  /**
   *	The initial index from which to return the results.
   */
  offset?: number;
}

/**
 * BaseSearchParams interface
 */

export interface BaseSearchParams extends BaseGetParams {
  /**
   * 	A search term.
   */
  search?: string;
}
