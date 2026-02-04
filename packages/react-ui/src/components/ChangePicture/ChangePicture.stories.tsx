import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ChangePicture, { ChangePictureProps } from './index';

export default {
  title: 'Design System/React UI/ChangePicture',
  component: ChangePicture
} as Meta<typeof ChangePicture>;

const template = (args: ChangePictureProps) => (
  <div style={{width: 400}}>
    <ChangePicture {...args} />
  </div>
);

export const Base: StoryObj<typeof ChangePicture> = {
  render: template
};
