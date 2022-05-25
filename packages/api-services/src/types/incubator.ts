/**
 * IncubatorCreateParams interface
 */

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
