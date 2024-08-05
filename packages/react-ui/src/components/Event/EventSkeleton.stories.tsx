import type { Meta, StoryObj } from '@storybook/react';
import EventSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Event',
  component: EventSkeleton
} as Meta<typeof EventSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <EventSkeleton {...args} />
  </div>
);

export const Base: StoryObj<EventSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
