import type { Meta, StoryObj } from '@storybook/react';
import ChangeCover from './index';

export default {
  title: 'Design System/React UI/Change Cover',
  component: ChangeCover
} as Meta<typeof ChangeCover>;

const template = (args) => (
  <div style={{width: 400}}>
    <ChangeCover {...args} />
  </div>
);

export const Base: StoryObj<ChangeCover> = {
  render: template
};

