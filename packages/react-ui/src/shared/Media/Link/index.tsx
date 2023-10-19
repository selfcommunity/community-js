import DisplayComponent from './DisplayComponent';
import TriggerButton from './TriggerButton';
import LayerComponent from './LayerComponent';
import PreviewComponent from './PreviewComponent';
import filter from './filter';
import {SCMediaObjectType} from '../../../types/media';

const Link: SCMediaObjectType = {
  name: 'link',
  displayComponent: DisplayComponent,
  triggerButton: TriggerButton,
  layerComponent: LayerComponent,
  previewComponent: PreviewComponent,
  filter
};

export default Link;
