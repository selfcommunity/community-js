/**
 * SCAvatarType interface
 */

export interface SCAvatarType {
  /**
   * Id value identifying this avatar.
   */
  id: number;
  /**
   * Is the primary avatar for the user?
   */
  primary: boolean;
  /**
   * The avatar url.
   */
  avatar: string | null;
  /**
   * Upload datetime.
   */
  date_uploaded: Date | string;
  /**
   * The id of the user for this avatar.
   */
  user: number;
}
