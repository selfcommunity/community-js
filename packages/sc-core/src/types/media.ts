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
   * Order in the list of medias
   */
  order?: number;

  /**
   * Embed associated
   */
  embed?: SCEmbedType;
}
