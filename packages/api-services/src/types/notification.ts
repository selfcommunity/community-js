import {SCEmbedType} from '@selfcommunity/types';

/**
 *  CustomNotificationParams interface
 */
export interface CustomNotificationParams {
  /**
   * Can be 'connections' or 'user' (default is 'conections')
   */
  recipients_type?: string;
  /**
   * 	An optional custom string to differentiate notifications
   */
  type?: string;
  /**
   * Embed obj.
   */
  embed?: SCEmbedType;
  /**
   * A title for the notification
   */
  title: string;
  /**
   * A description for the notification
   */
  description: string;
  /**
   * The user who issues the notification(its ID)
   */
  user: number;
}
