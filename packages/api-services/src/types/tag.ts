/**
 * TagParams interface
 */
export interface TagParams {
  /**
   * Is this tag active?
   */
  active?: boolean;
  /**
   * The type of the tag (unique together name).
   * It can be "user" (only for users) or "category" (only for category).
   */
  type?: string;
  /**
   * The name of the tag (unique together type).
   */
  name: string;
  /**
   * Tag description
   */
  description?: string;
  /**
   * Hexadecimal format color code with #
   */
  color?: string;
  /**
   * 	Is this tag publicly visible?
   */
  visible?: boolean;
  /**
   * 	The tag add a visibility boost.
   */
  visibility_boost?: boolean;
  /**
   * Is this tag deleted?
   */
  deleted?: boolean;
}
