/**
 * Interface SCWebhookEndpointType
 * Webhook Schema
 */

export interface SCWebhookEndpointType {
  /**
   * Webhook id
   */
  id: number;
  /**
   * Webhook creation date-time
   */
  created_at: Date | string;
  /**
   * Webhook update date-time
   */
  updated_at: Date | string;
  /**
   * Active status
   */
  is_active: boolean;
  /**
   * Webhook target
   */
  target: string;
  /**
   * Webhook description
   */
  description: string;
  /**
   * Webhook events
   */
  events: SCWebhookEventsType[];
  /**
   * Webhook SSL certificates for HTTPS requests.
   */
  ssl_cert_verification: boolean;
}

export interface SCWebhookEndpointAttemptType {
  /**
   * Webhook attempt id
   */
  id: number;
  /**
   * Webhook attempt creation date-time
   */
  created_at: Date | string;
  /**
   * Webhook attempt event
   */
  event: SCWebhookEventsType[];
  /**
   * Webhook attempt sent date-time
   */
  sent_at: Date | string;
  /**
   * Active status
   */
  http_request_body: string;
  /**
   * Http request signature header
   */
  http_request_signature_header: string;
  /**
   * Http response code
   */
  http_response_code: number;
  /**
   * Http response body
   */
  http_response_body: string;
  /**
   * Date time of next retry
   */
  next_retry: Date | string;
}

export interface SCWebhookEndpointSecretType {
  signing_secret: string;
}

export interface SCWebhookEventsType {
  /**
   * Webhook event type: contains the name of the event that triggered the webhook
   * example: "category.follow"
   */
  type: string;
  /**
   * Creation date time
   */
  added_at: Date | string;
}
