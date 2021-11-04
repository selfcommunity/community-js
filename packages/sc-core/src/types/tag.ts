/**
 * Interface SCTagType.
 * Tag Schema.
 */
export interface SCTagType {
  /**
   * Unique integer value identifying this tag.
   */
  id: number;

  /**
   * The type of the tag (unique together name).
   */
  type: string;

  /**
   * The name of the tag (unique together type).
   */
  name: string;

  /**
   * Short description of the tag.
   */
  description?: string;

  /**
   * Hexadecimal format color code with prefix '#'.
   */
  color: string;

  /**
   * Tag publicly visible.
   */
  visible: boolean;

  /**
   * The tag has a visibility boost.
   */
  visibility_boost: boolean;

  /**
   * Creation date time.
   */
  created_at: Date;

  /**
   * Tag active or not
   */
  active: boolean;

  /**
   * Tag deleted or not
   */
  deleted: boolean;
}
