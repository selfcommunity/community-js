/**
 * Interface SCPrivateMessageType.
 * Private Message Schema.
 */
import {SCUserType} from '@selfcommunity/core';

export interface SCPrivateMessageType {
  /**
   * Id of the message
   */
  id: number;

  /**
   * Sender User
   */
  sender: SCUserType;
  /**
   * Sender id
   */
  sender_id: number;
  /**
   *Receiver User
   */
  receiver: SCUserType;

  /**
   * Message
   */
  html: string;

  /**
   * Send date time
   */
  created_at: Date | string;
  /**
   * Last interaction date time
   */
  last_message_at: Date;

  /**
   * Message status: created, deleted or hidden message
   */
  thread_status: SCPrivateMessageStatusType;

  /**
   * file
   */
  file?: any;
  /**
   * Headline
   */
  headline: string;
  /**
   * Message content
   */
  message: string;
}

/**
 * Private Message status:
 * created, deleted or hidden message
 */
export enum SCPrivateMessageStatusType {
  CREATED = 'created',
  DELETED = 'deleted',
  HIDDEN = 'hidden',
}
