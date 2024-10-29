/**
 * Metadata type field
 */
export enum SCMetadataTypeFieldType {
  STRING = 'string',
  EMAIL = 'email',
  URL = 'url',
  ENUM = 'enum',
  PHONE_NUMBER = 'phone_number',
  CHECKBOX = 'checkbox'
}

/**
 * Metadata type used to render custom fields
 */
export interface SCMetadataType {
  /**
   * The label of the metadata
   */
  label: string;
  /**
   * Is the metadata mandatory for the user
   */
  mandatory?: boolean;
  /**
   * If the metadata is editable for the user (only for the enum type)
   */
  editable?: boolean;
  /**
   * Is the metadata visible in signup form
   */
  in_signup?: boolean;
  /**
   * Is metadata visible in exports
   */
  in_export?: boolean;
  /**
   * Metadata type
   */
  type?: SCMetadataTypeFieldType;
  /**
   * Options for the enum type
   */
  type_options?: string[];
  /**
   * The type tagging
   */
  type_tagging?: Record<string, number[]>;
}
