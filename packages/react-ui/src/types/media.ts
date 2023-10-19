import { ReactElement } from 'react';

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
  displayComponent: (props: any) => ReactElement;

  /**
   * Hook for insert custom props to preview component
   */
  displayProps?: any;

  /**
   * The button used to trigger the action
   */
  triggerButton: (props: any) => ReactElement;

  /**
   * The component used to preview the list of media of this type in the composer
   */
  previewComponent: (props: any) => ReactElement;

  /**
   * The component used to interact with the list of media of this type
   */
  layerComponent: (props: any) => ReactElement;

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

/**
 * Interface MediaChunkType
 */
export interface SCMessageChunkType {
  id: number;
  file_uuid: string;
  filename: string;
  url: string;
  completed: number;
  error: string;
  type: string;
  thumbnail: string;
}
