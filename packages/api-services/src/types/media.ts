import {SCEmbedType} from '@selfcommunity/types/src/types';
/**
 * Interface MediaCreateParams
 */
export interface MediaCreateParams {
  /**
   * The media type.
   */
  type: MediaTypes;
  /**
   * Required if media type is url
   */
  url?: string;
  /**
   * Required if media type is share
   */
  share_object?: number;
  /**
   * Required if media type is embed
   */
  embed?: SCEmbedType;
}

export enum MediaTypes {
  URL = 'url',
  SHARE = 'share',
  EMBED = 'embed'
}

/**
 * Interface ChunkUploadParams
 */

export interface ChunkUploadParams {
  /**
   * String returned by the first call and required from the second
   */
  upload_id: string;
  /**
   * The expiration time.
   */
  expires?: string;
  /**
   * The image chunk to be uploaded
   */
  image?: Blob;
  /**
   * The document chunk to be uploaded
   */
  document?: Blob;
}

/**
 * Interface ChunkUploadCompleteParams
 */

export interface ChunkUploadCompleteParams {
  /**
   * Default to image or document based on file extension
   */
  type?: ChunkType;
  /**
   * Id of the chunk uploaded file.
   */
  upload_id: string;
  /**
   * MD5 hash of the original file for checksum proposal
   */
  md5: string;
}

export enum ChunkType {
  /**
   * Image media type
   */
  IMAGE = 'image',
  /**
   * 	Document media type (only pdf documents are supported)
   */
  DOC = 'doc',
  /**
   * Other images related to contributes. eg. Images uploaded and inserted as <img> into the contribute text
   */
  EIMAGE = 'eimage'
}
