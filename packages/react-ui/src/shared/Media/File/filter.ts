import {SCMediaType} from '@selfcommunity/types/src/types';
import {MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE} from '../../../constants/Media';

export const filteredImages = (media: SCMediaType): boolean => media.type === MEDIA_TYPE_IMAGE;
export const filteredDocs = (media: SCMediaType): boolean => media.type === MEDIA_TYPE_DOCUMENT;
