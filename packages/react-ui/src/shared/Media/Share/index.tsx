import { SCMediaObjectType } from '../../../types/media';
import DisplayComponent from './DisplayComponent';
import filter from './filter';

const Share: SCMediaObjectType = {
  name: 'share',
  displayComponent: DisplayComponent,
  triggerButton: null,
  layerComponent: null,
  previewComponent: null,
  filter
};

export default Share;
