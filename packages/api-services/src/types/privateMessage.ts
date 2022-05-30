import {SCPrivateMessageFileType} from '@selfcommunity/types/src/types';
/**
 * ThreadParams interface.
 */
export interface ThreadParams {
  /**
   * The id of the thread(one between thread or user is required).
   */
  thread: number;
  /**
   * The id of the user(one between thread or user is required).
   */
  user?: number;
  /**
   * Return all messages before this id of the message (excluded before_message).
   */
  before_message?: number;
  /**
   * 	Return all messages from this id of the message (included from_message).
   */
  from_message?: number;
  /**
   * 	Number of results to return per page.
   */
  limit?: number;
  /**
   * The initial index from which to return the results.
   */
  offset?: number;
}

/**
 * MessageCreateParams interface.
 */
export interface MessageCreateParams {
  /**
   * The id(s) of the recipient(s) of the message
   */
  recipients: number | number[];
  /**
   * 	The content of the message. It is required when file_uuid param is missing.
   */
  message: string;
  /**
   * The private message file
   */
  file_uuid?: SCPrivateMessageFileType;
}

/**
 * MessageMediaUploadParams interface.
 */
export interface MessageMediaUploadParams {
  /**
   * The file to upload.
   */
  qqfile: Blob;
  /**
   * The type of the file to upload.
   */
  qqfiletype?: string;
  /**
   * The name of the file to upload.
   */
  qqfilename?: string;
  /**
   * The duration (in seconds) of the video or audio track to upload.
   */
  qqduration?: number;
  /**
   * The size of the file to upload.
   */
  qqtotalfilesize?: number;
  /**
   * The MD5 of the file to upload.
   */
  qqmd5?: string;
}

/**
 * MessageThumbnailUploadParams interface.
 */
export interface MessageThumbnailUploadParams {
  /**
   * The file to upload.
   */
  qqfile: Blob;
  /**
   * The parent file uuid. It has to be the file_uuid returned by the previous call
   */
  qqparentuuid: string;
  /**
   * The type of the file to upload.
   */
  qqfiletype?: string;
  /**
   * The name of the file to upload.
   */
  qqfilename?: string;

  /**
   * The size of the file to upload.
   */
  qqtotalfilesize?: number;
  /**
   * The MD5 of the file to upload.
   */
  qqmd5?: string;
}

/**
 * MessageMediaChunksParams interface.
 */
export interface MessageMediaChunksParams {
  /**
   * The file to upload.
   */
  qqfile: Blob;
  /**
   * The file uuid returned by the first chunk upload. It is required only when qqpartindex > 0.
   */
  qquuid: string;
  /**
   * The index of the chunk part to upload. It starts at 0 and reaches qqtotalparts -1.
   */
  qqpartindex: number;
  /**
   * The number of total parts of the chunk to upload.
   */
  qqtotalparts: number;
  /**
   * The type of the file to upload.
   */
  qqfiletype?: string;
  /**
   * The size of the file to upload.
   */
  qqtotalfilesize?: number;
  /**
   * 	The chunk byte offset.
   */
  qqpartbyteoffset?: number;
  /**
   * 	The size of the chunk.
   */
  qqchunksize?: number;
  /**
   * The name of the file to upload.
   */
  qqfilename?: string;
}

/**
 * MessageChunkUploadDoneParams interface.
 */
export interface MessageChunkUploadDoneParams {
  /**
   * The file uuid returned by the first chunk upload. It is required only when qqpartindex > 0.
   */
  qquuid: string;
  /**
   * The name of the file to upload.
   */
  qqfilename: string;
  /**
   * The number of total parts of the chunk to upload.
   */
  qqtotalparts?: number;
  /**
   * The MD5 of the file to upload.
   */
  qqmd5?: string;
  /**
   * The type of the file to upload.
   */
  qqfiletype?: string;
  /**
   * The size of the file to upload.
   */
  qqtotalfilesize?: number;
}
