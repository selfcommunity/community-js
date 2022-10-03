/**
 * SCReactionType interface
 */

export interface SCReactionType {
  /**
   * Unique integer value identifying this reaction
   */
  id?: number;
  /**
   * The label of the reaction (unique)
   */
  label?: string;
  /**
   * 	The sentiment value associated to the reaction
   */
  sentiment?: number;
  /**
   * The image url of the reaction
   */
  image?: string;
  /**
   * 	Is this reaction active?
   */
  active?: boolean;
}
