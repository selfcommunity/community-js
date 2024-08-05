import type { Meta, StoryObj } from '@storybook/react';
import EventLocationWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/EventLocationWidget',
  component: EventLocationWidgetSkeleton
} as Meta<typeof EventLocationWidgetSkeleton>;

const template = (args) => (
    <EventLocationWidgetSkeleton {...args} />
);

export const Base: StoryObj<EventLocationWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
};
