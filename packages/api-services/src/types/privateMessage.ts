import {SCPrivateMessageFileType} from '@selfcommunity/types';
/**
 * ThreadParams interface.
 */
export interface ThreadParams {
  /**
   * The id of the thread(one between thread or user is required).
   */
  thread?: number;
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
   * The id of the group.
   */
  group?: number;
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
 * Delete Thread Params interface.
 */
export interface ThreadDeleteParams {
  /**
   * The id of the thread(one between thread or user is required).
   */
  thread?: number;
  /**
   * The id of the user(one between thread or user is required).
   */
  user?: number;
}

/**
 * MessageCreateParams interface.
 */
export interface MessageCreateParams {
  /**
   * The id(s) of the recipient(s) of the message. If present, group is null.
   */
  recipients?: number | number[];
  /**
   * The id of the group where the message is sent. If present, recipients is null.
   */
  group?: number;
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
  file: Blob;
  /**
   * The type of the file to upload.
   */
  filetype?: string;
  /**
   * The name of the file to upload.
   */
  filename?: string;
  /**
   * The duration (in seconds) of the video or audio track to upload.
   */
  duration?: number;
  /**
   * The size of the file to upload.
   */
  totalfilesize?: number;
  /**
   * The MD5 of the file to upload.
   */
  md5?: string;
}

/**
 * MessageThumbnailUploadParams interface.
 */
export interface MessageThumbnailUploadParams {
  /**
   * The file to upload.
   */
  file: Blob;
  /**
   * The parent file uuid. It has to be the file_uuid returned by the previous call
   */
  parentuuid: string;
  /**
   * The type of the file to upload.
   */
  filetype?: string;
  /**
   * The name of the file to upload.
   */
  filename?: string;

  /**
   * The size of the file to upload.
   */
  totalfilesize?: number;
  /**
   * The MD5 of the file to upload.
   */
  md5?: string;
}

/**
 * MessageMediaChunksParams interface.
 */
export interface MessageMediaChunksParams {
  /**
   * The file to upload.
   */
  file: Blob;
  /**
   * The file uuid returned by the first chunk upload. It is required only when partindex > 0.
   */
  uuid: string;
  /**
   * The index of the chunk part to upload. It starts at 0 and reaches totalparts -1.
   */
  partindex: number;
  /**
   * The number of total parts of the chunk to upload.
   */
  totalparts: number;
  /**
   * The type of the file to upload.
   */
  filetype?: string;
  /**
   * The size of the file to upload.
   */
  totalfilesize?: number;
  /**
   * 	The chunk byte offset.
   */
  partbyteoffset?: number;
  /**
   * 	The size of the chunk.
   */
  chunksize?: number;
  /**
   * The name of the file to upload.
   */
  filename?: string;
}

/**
 * MessageChunkUploadDoneParams interface.
 */
export interface MessageChunkUploadDoneParams {
  /**
   * The file uuid returned by the first chunk upload. It is required only when partindex > 0.
   */
  uuid: string;
  /**
   * The name of the file to upload.
   */
  filename: string;
  /**
   * The number of total parts of the chunk to upload.
   */
  totalparts?: number;
  /**
   * The MD5 of the file to upload.
   */
  md5?: string;
  /**
   * The type of the file to upload.
   */
  filetype?: string;
  /**
   * The size of the file to upload.
   */
  totalfilesize?: number;
}
