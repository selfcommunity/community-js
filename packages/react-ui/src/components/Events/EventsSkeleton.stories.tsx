import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Events',
  component: EventsSkeleton,
} as Meta<typeof EventsSkeleton>;

const template = (args) => (
  <div>
    <EventsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<EventsSkeleton> = {
  render: template
};