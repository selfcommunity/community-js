/**
 * Interface SCPrivateMessageType.
 * Private Message Schema.
 */
import {SCUserType} from './user';

export interface SCPrivateMessageType {
  /**
   * Message status: created, deleted or hidden message
   */
  status: string;
  /**
   * Id of the message
   */
  id: number;

  /**
   * Sender User
   */
  sender: SCUserType;
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
  file?: SCPrivateMessageFileType;
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
  NEW = 'new',
}

export interface SCPrivateMessageFileType {
  /**
   * The file id
   */
  uuid?: string;

  /**
   * File name
   */
  filename?: string;

  /**
   * File size
   */
  filesize?: number;

  /**
   * The type of the file
   */
  mimetype?: SCMessageFileType;

  /**
   * The duration (in seconds) of the file
   */
  duration?: number;

  /**
   * File Url
   */
  url?: string;
  /**
   * File thumbnail
   */
  thumbnail?: string;
  /**
   * File Url(response)
   */
  file_url?: string;
  /**
   * The file id(response)
   */
  file_uuid?: string;
}

/**
 * Private Message status:
 * created, deleted or hidden message
 */
export enum SCMessageFileType {
  DOCUMENT = 'application/',
  IMAGE = 'image/',
  VIDEO = 'video/',
}
