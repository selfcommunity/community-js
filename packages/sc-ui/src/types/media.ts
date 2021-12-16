import React from 'react';

/**
 * Interface MediaObject
 */
export interface SCMediaObjectType {
  /**
   * The media action name, used for triggering the change view
   */
  name: string;

  /**
   * The component used to display media
   */
  previewComponent: React.ElementType;

  /**
   * The button used to trigger the action
   */
  editButton: React.ElementType;

  /**
   * The component used to interact with the list of media of this type
   */
  editComponent: React.ElementType;

  /**
   * The function used to filter media objects for rendering purpose
   */
  filter: (media: any) => boolean;
}

/**
 * Interface MediaChunkType
 */
export interface SCMediaChunkType {
  id: number;
  name: string;
  type: string;
  image: string;
  completed: number;
  error: string;
  upload_id: string;
}
