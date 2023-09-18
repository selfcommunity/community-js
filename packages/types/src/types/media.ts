import {SCEmbedType} from './embed';

/**
 * Interface SCMediaType.
 * Media Schema.
 */
export interface SCMediaType {
  /**
   * Id of the media
   */
  id: number;

  /**
   * Added at
   */
  added_at: Date;

  /**
   * Media type
   */
  type: string;

  /**
   * Title
   */
  title?: string;

  /**
   * Title
   */
  description?: string;

  /**
   * Media Url
   */
  url?: string;

  /**
   * Media image
   */
  image?: string;

  /**
   * Media image width
   */
  image_width?: number;

  /**
   * Media image height
   */
  image_height?: number;

  /**
   * Media image thumbnail
   */
  image_thumbnail?: {
    color?: string | null;
    width: number;
    height: number;
    url: string;
  }

  /**
   * Order in the list of medias
   */
  order?: number;

  /**
   * Embed associated
   */
  embed?: SCEmbedType;
}

/**
 * SCChunkMediaType interface
 */
export interface SCChunkMediaType {
  /**
   * Media upload id
   */
  upload_id: string;
  /**
   * The offset
   */
  offset: string;
  /**
   * Expiration time
   */
  expires: string;
}
