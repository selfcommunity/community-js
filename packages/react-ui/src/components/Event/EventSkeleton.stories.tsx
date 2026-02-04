import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventSkeleton, { EventSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Event',
  component: EventSkeleton
} as Meta<typeof EventSkeleton>;

const template = (args:EventSkeletonProps) => (
  <div style={{ width: '50%' }}>
    <EventSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof EventSkeleton> = {
  render: template
};
