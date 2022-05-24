/**
 * Interface WebhookCreateType
 */

export interface WebhookParamType {
  /**
   * Active status
   */
  is_active?: boolean;
  /**
   * Webhook target
   */
  target: string;
  /**
   * Webhook description
   */
  description?: string;
  /**
   * Webhook events
   */
  events: WebhookEventsType[];
  /**
   * Webhook SSL certificates for HTTPS requests.
   */
  ssl_cert_verification?: boolean;
}

export interface WebhookEventsType {
  type: string;
}
