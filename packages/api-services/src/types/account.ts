/**
 * AccountCreateParams interface
 */

export interface AccountCreateParams {
  /**
   * Username field for the account
   */
  username: string;
  /**
   * 	Email field for the account
   */
  email: string;
  /**
   * 	Password field for the account
   */
  password: string;
  /**
   * 	Optional Invite Code field
   */
  invite_code?: string;
  /**
   * 	Optional Promo Code field
   */
  promo_code?: string;
  /**
   * Any other properties available in user_metadata_definition
   */
  [p: string]: any;
}

export interface AccountVerifyParams {
  /**
   * Validation code sent by email
   */
  validation_code: string;
}

export interface AccountRecoverParams {
  /**
   * 	Email field for the account
   */
  email: string;
}

export interface AccountResetParams extends AccountVerifyParams {
  /**
   * 	Password field for the account
   */
  password: string;
}

export interface AccountSearchParams {
  /**
   * Username field for the account
   */
  username?: string;
  /**
   * 	Email field for the account
   */
  email?: string;
  /**
   * Ext ID field for the account (used in combination with provider)
   */
  ext_id?: string;
  /**
   * 	Provider field for the account (used in combination with ext_id)
   */
  provider?: string;
}
