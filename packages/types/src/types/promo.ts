/**
 * Interface SCInviteType.
 * Invite Code Schema.
 */
export interface SCPromoType {
  /**
   * The ID of the user.
   */
  id: number;

  /**
   * The promo code name
   */
  name: string;

  /**
   * The invitation code
   */
  code: string;

  /**
   * The date from which the promo code is valid
   */
  valid_from: Date;

  /**
   * The date to which the promo code is valid
   */
  valid_to: Date;
}
