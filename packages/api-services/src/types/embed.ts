import {BaseGetParams} from './baseParams';

/**
 * EmbedUpdateParams interface
 */

export interface EmbedUpdateParams {
  /**
   * Url for the resource, if any
   */
  url?: string | null;

  /**
   * Metadata associated to this embed. It mus be a valid json object.
   * For embed_type sc_vimeo or sc_link it contains metadata associated
   * with the external resource. For embed_type sc_shared_object it contains a field
   * type that is the type of the object (Discussion or Post) and a field id
   * that contains the id of the object shared
   */
  metadata: Record<string, any>;
}

/**
 * EmbedSearchParams interface
 */
export interface EmbedSearchParams extends BaseGetParams {
  embed_type: string;
  embed_id: string;
}
