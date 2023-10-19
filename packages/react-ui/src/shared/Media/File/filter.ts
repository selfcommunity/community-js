import { SCMediaType } from '@selfcommunity/types/src/types';
import { MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE } from '../../../constants/Media';

export default (media: SCMediaType): boolean => media.type === MEDIA_TYPE_IMAGE || media.type === MEDIA_TYPE_DOCUMENT;