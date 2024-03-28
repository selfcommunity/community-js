import type { Meta, StoryObj } from '@storybook/react';
import ChangeGroupCover from './index';

export default {
  title: 'Design System/React UI/Change Group Cover',
  component: ChangeGroupCover
} as Meta<typeof ChangeGroupCover>;

const template = (args) => (
  <div style={{width: 400}}>
    <ChangeGroupCover {...args} />
  </div>
);

export const Base: StoryObj<ChangeGroupCover> = {
  render: template
};

