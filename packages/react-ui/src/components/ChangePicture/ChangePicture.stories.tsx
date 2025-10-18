import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ChangePicture from './index';

export default {
  title: 'Design System/React UI/ChangePicture',
  component: ChangePicture
} as Meta<typeof ChangePicture>;

const template: StoryObj<typeof ChangePicture> = (args) => (
  <div style={{width: 400}}>
    <ChangePicture {...args} />
  </div>
);

export const Base: StoryObj<ChangePicture> = {
  render: template
};
