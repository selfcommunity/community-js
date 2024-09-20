import type { Meta, StoryObj } from '@storybook/react';
import EventHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Event Header',
  component: EventHeaderSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof EventHeaderSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <EventHeaderSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof EventHeaderSkeleton> = {
  render: template
};
