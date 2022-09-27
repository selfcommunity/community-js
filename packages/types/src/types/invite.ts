import {SCUserType} from './user';

/**
 * Interface SCInviteType.
 * Invite Code Schema.
 */
export interface SCInviteType {
  /**
   * The ID of the user.
   */
  id: number;

  /**
   * The invitation name
   */
  name: string;

  /**
   * The invitation email
   */
  email: string;

  /**
   * The invitation code
   */
  code: string;

  /**
   * The date when the invitation code was generated
   */
  generated_at: Date;

  /**
   * The date when the invitation code was sent to the user
   */
  sent_at: Date | null;

  /**
   * The date when the invitation code was used by the user
   */
  used_at: Date | null;

  /**
   * The user object associated to this invite code (if used_at is not null)
   */
  user: SCUserType | null;
}
