import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamRoom from './index';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamRoom',
  component: LiveStreamRoom,
} as Meta<typeof LiveStreamRoom>;

const template = (args) => (
  <div style={{width: 800}}>
    <LiveStreamRoom {...args} />
  </div>
);


export const Base: StoryObj<typeof LiveStreamRoom> = {
  args: {},
  render: template
};
