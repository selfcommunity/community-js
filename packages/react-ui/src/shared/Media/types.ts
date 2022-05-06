import {SCMediaType} from '@selfcommunity/types';
import {SCMediaChunkType} from '../../types';
import {SyntheticEvent} from 'react';

export interface EditMediaProps {
  /**
   * Medias
   * @default []
   */
  medias?: SCMediaType[];
  /**
   * Handles on success
   */
  onSuccess: (media: SCMediaType) => void;
  /**
   * Handles on progress
   */
  onProgress?: (chunks: SCMediaChunkType[]) => void;
  /**
   * Handles on sort
   */
  onSort: (newSort: SCMediaType[]) => void;
  /**
   * Handles on delete
   */
  onDelete: (id?: number) => (event: SyntheticEvent) => void;
}
