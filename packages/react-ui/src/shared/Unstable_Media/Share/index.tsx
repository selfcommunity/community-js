import { UnstableSCMediaObjectType } from '../../../types/media';
import DisplayComponent from './DisplayComponent';
import { MEDIA_TYPE_SHARE } from '../../../constants/Media';
import { SCMediaType } from '@selfcommunity/types';
import filter from './filter';

const Share: UnstableSCMediaObjectType = {
  name: 'share',
  displayComponent: DisplayComponent,
  triggerButton: null,
  layerComponent: null,
  previewComponent: null,
  filter
};

export default Share;
