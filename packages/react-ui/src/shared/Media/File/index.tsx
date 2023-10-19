import DisplayComponent from './DisplayComponent';
import TriggerButton from './TriggerButton';
import { SCMediaObjectType } from '../../../types/media';
import PreviewComponent from './PreviewComponent';
import filter from './filter';

const File: SCMediaObjectType = {
  name: 'file',
  displayComponent: DisplayComponent,
  triggerButton: TriggerButton,
  layerComponent: null,
  previewComponent: PreviewComponent,
  filter
};

export default File;
