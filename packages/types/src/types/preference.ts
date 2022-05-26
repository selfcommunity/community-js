/**
 * SCPreferenceType interface
 */
export interface SCPreferenceType {
  /**
   * Unique integer value identifying this dynamic preference
   */
  id?: number;
  /**
   * Grouping name
   */
  section?: string;
  /**
   * 	Unique name identifying this dynamic preference
   */
  name?: string;
  /**
   * 	The value of the dynamic preference (can be an integer or a string)
   */
  value: string;
}
