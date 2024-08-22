import {SCMediaType} from '@selfcommunity/types/src/types';
import {MEDIA_TYPE_EVENT} from '../../../constants/Media';

export default (media: SCMediaType): boolean => media.type === MEDIA_TYPE_EVENT;
