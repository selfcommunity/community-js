/**
 * SCDataPortabilityType interface
 */
export interface SCDataPortabilityType {
  /**
   * Is still processing your data?
   */
  computing?: true;
  /**
   * Has already sent the email?
   */
  send_email?: true;
  /**
   * 	Request date time
   */
  requested_at?: Date | string;
  /**
   * 	Generation date time
   */
  generated_at?: Date | string;
  /**
   * 	Email sent date time
   */
  email_sent_at?: Date | string;
  /**
   * Download date time
   */
  downloaded_at?: Date | string;
}
