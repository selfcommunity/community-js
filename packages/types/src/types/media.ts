import {SCEmbedType} from './embed';

/**
 * SCMimeTypes
 */
export enum SCMimeTypes {
  // Images
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',

  // TEXTS
  PLAIN_TEXT = 'text/plain',
  CSV = 'text/csv',

  // PDF
  PDF = 'application/pdf',

  // Microsoft Word
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOTX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  DOCM = 'application/vnd.ms-word.document.macroEnabled.12',
  DOTM = 'application/vnd.ms-word.template.macroEnabled.12',

  // Microsoft Excel
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLTX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  XLSM = 'application/vnd.ms-excel.sheet.macroEnabled.12',
  XLTM = 'application/vnd.ms-excel.template.macroEnabled.12',
  XLAM = 'application/vnd.ms-excel.addin.macroEnabled.12',
  XLSB = 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',

  // Microsoft PowerPoint
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  POTX = 'application/vnd.openxmlformats-officedocument.presentationml.template',
  PPSX = 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  PPAM = 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
  PPTM = 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  POTM = 'application/vnd.ms-powerpoint.template.macroEnabled.12',
  PPSM = 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',

  // OpenDocument
  ODT = 'application/vnd.oasis.opendocument.text',
  ODS = 'application/vnd.oasis.opendocument.spreadsheet',
  ODP = 'application/vnd.oasis.opendocument.presentation',
  ODG = 'application/vnd.oasis.opendocument.graphics',
  ODB = 'application/vnd.oasis.opendocument.database',
  ODF = 'application/vnd.oasis.opendocument.formula',
  OTT = 'application/vnd.oasis.opendocument.text-template',
  OTS = 'application/vnd.oasis.opendocument.spreadsheet-template',
  OTP = 'application/vnd.oasis.opendocument.presentation-template',
  OTG = 'application/vnd.oasis.opendocument.graphics-template'
}

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
   * Mimetype image
   */
  image_mimetype?: SCMimeTypes;

  /**
   * Media image thumbnail
   */
  image_thumbnail?: {
    url: string;
    width: number;
    height: number;
    color?: string | null;
  };

  /**
   * Order in the list of medias
   */
  order?: number;

  /**
   * Embed associated
   */
  embed?: SCEmbedType;

  /**
   * File size
   */
  size?: number | null;

  /**
   * Mimetype
   */
  mimetype?: SCMimeTypes;
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
