/**
 * Interface SCPrivateMessageThreadType.
 * Thread Private Message Schema.
 */
import {SCUserType} from './user';
import {SCGroupType} from './group';

export interface SCPrivateMessageThreadType {
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
   * Message content
   */
  message: string;

  /**
   * Send date time
   */
  created_at: Date | string;

  /**
   * Message status: created, deleted or hidden message
   */
  status: string;

  /**
   * file
   */
  file?: SCPrivateMessageFileType;
}
/**
 * Interface SCPrivateMessageSnippetType.
 * Snippet Private Message Schema.
 */
export interface SCPrivateMessageSnippetType {
  /**
   * Id of the message
   */
  id: number;

  /**
   * Headline
   */
  headline: string;
  /**
   * Message
   */
  message: string;

  /**
   * Sender User
   */
  sender: SCUserType;
  /**
   *Receiver User
   */
  receiver: SCUserType;
  /**
   *Group item
   */
  group?: SCGroupType;

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
}

/**
 * Private Message status:
 * created, deleted or hidden message
 */
export enum SCPrivateMessageStatusType {
  CREATED = 'created',
  DELETED = 'deleted',
  HIDDEN = 'hidden',
  NEW = 'new'
}

/**
 * Private Message type:
 * it can be user or group type
 */
export enum SCPrivateMessageType {
  GROUP = 'group',
  USER = 'user'
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
  PDF = 'application/pdf',
  AUDIO = 'audio/'
}

/**
 * SCPrivateMessageUploadMediaType interface
 */
export interface SCPrivateMessageUploadMediaType {
  file_url: string;
  file_uuid: string;
}

/**
 * SCPrivateMessageUploadThumbnailType interface
 */
export interface SCPrivateMessageUploadThumbnailType {
  file_url: string;
  file_uuid: string;
  parent_file_uuid: string;
}

/**
 * SCPrivateMessageUploadMediaChunkType interface
 */
export interface SCPrivateMessageUploadMediaChunkType {
  file_uuid: string;
}
