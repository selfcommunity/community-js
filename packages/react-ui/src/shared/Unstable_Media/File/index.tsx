import DisplayComponent from './DisplayComponent';
import TriggerButton from './TriggerButton';
import { UnstableSCMediaObjectType } from '../../../types/media';
import PreviewComponent from './PreviewComponent';
import filter from './filter';

const File: UnstableSCMediaObjectType = {
  name: 'file',
  displayComponent: DisplayComponent,
  triggerButton: TriggerButton,
  layerComponent: null,
  previewComponent: PreviewComponent,
  filter
};

export default File;
