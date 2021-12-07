import {SCEmbedType} from './index';

/**
 * Interface SCCustomNotificationType.
 * Custom Notification Schema.
 */
export interface SCCustomNotificationType {
  /**
   * Id of the custom notification
   */
  id: number;

  /**
   * Custom type notification
   */
  type: string;

  /**
   * Embed object if exist
   */
  embed?: SCEmbedType;

  /**
   * Notification title
   */
  title?: string;

  /**
   * Notification description
   */
  description?: string;
}
