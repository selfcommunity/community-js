import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventsSkeleton, { EventsSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Events',
  component: EventsSkeleton,
} as Meta<typeof EventsSkeleton>;

const template = (args: EventsSkeletonProps) => (
  <div>
    <EventsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof EventsSkeleton> = {
  render: template
};