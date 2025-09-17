/**
 * ContactUsRequestParams interface
 */

export interface ContactUsRequestParams {
  /**
   * name field for the account
   */
  name?: string;
  /**
   * Surname field for the account
   */
  surname?: string;
  /**
   * Email field for the account
   */
  email?: string;
  /**
   * Contact request message text
   */
  message?: string;
  /**
   * Any other properties available in user_metadata_definition
   */
  [p: string]: any;
}
