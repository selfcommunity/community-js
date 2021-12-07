/**
 * Interface SCPrivateMessageType.
 * Private Message Schema.
 */
import { SCUserType } from '@selfcommunity/core';

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
   * Message
   */
  html: string;

  /**
   * Send date time
   */
  created_at: Date;

  /**
   * Message status: created, deleted or hidden message
   */
  status: SCPrivateMessageStatusType;

  /**
   * file
   */
  file?: any;
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
