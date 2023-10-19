/**
 * Interface SCEmbedType.
 * Embed Schema.
 */
export interface SCEmbedType {
  /**
   * Id of the embed
   */
  id: number;

  /**
   * Type of the embed, can be any string except
   * sc_vimeo, sc_link or sc_shared_object that are used
   * for embedded objects automatically created by the community
   */
  embed_type: string;

  /**
   * External id for the embed object
   */
  embed_id: number | string;

  /**
   * Url for the resource, if any
   */
  url?: string;

  /**
   * Metadata associated to this embed. It mus be a valid json object.
   * For embed_type sc_vimeo or sc_link it contains metadata associated
   * with the external resource. For embed_type sc_shared_object it contains a field
   * type that is the type of the object (Discussion or Post) and a field id
   * that contains the id of the object shared
   */
  metadata: Record<string, any>;
}
