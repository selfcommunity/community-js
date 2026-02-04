import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventSkeleton, { LiveStreamSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/LiveStream',
  component: EventSkeleton
} as Meta<typeof EventSkeleton>;

const template = (args: LiveStreamSkeletonProps) => (
  <div style={{ width: '50%' }}>
    <EventSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof EventSkeleton> = {
  render: template
};
