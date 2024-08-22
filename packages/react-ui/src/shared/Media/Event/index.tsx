import { SCMediaObjectType } from '../../../types/media';
import DisplayComponent from './DisplayComponent';
import filter from './filter';

const Event: SCMediaObjectType = {
  name: 'event',
  displayComponent: DisplayComponent,
  triggerButton: null,
  layerComponent: null,
  previewComponent: null,
  filter
};

export default Event;
