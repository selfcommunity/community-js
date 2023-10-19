import { SCMediaType } from '@selfcommunity/types/src/types';
import { MEDIA_TYPE_SHARE } from '../../../constants/Media';

export default (media: SCMediaType): boolean => media.type === MEDIA_TYPE_SHARE;