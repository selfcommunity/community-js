import DisplayComponent from './DisplayComponent';
import TriggerButton from './TriggerButton';
import LayerComponent from './LayerComponent';
import { MEDIA_EMBED_SC_LINK_TYPE, MEDIA_TYPE_URL } from '../../../constants/Media';
import { SCMediaType } from '@selfcommunity/types';
import { UnstableSCMediaObjectType } from '../../../types/media';
import PreviewComponent from './PreviewComponent';
import filter from './filter';

const Link: UnstableSCMediaObjectType = {
  name: 'link',
  displayComponent: DisplayComponent,
  triggerButton: TriggerButton,
  layerComponent: LayerComponent,
  previewComponent: PreviewComponent,
  filter
};

export default Link;
