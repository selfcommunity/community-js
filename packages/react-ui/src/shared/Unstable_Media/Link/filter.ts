import { SCMediaType } from '@selfcommunity/types/src/types';
import { MEDIA_EMBED_SC_LINK_TYPE, MEDIA_TYPE_URL } from '../../../constants/Media';

export default (media: SCMediaType): boolean => media.type === MEDIA_TYPE_URL && media.embed && media.embed.embed_type === MEDIA_EMBED_SC_LINK_TYPE;