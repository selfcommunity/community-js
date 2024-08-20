import type { Meta, StoryObj } from '@storybook/react';
import EventInfoWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Event Info Widget',
  component: EventInfoWidgetSkeleton,
  render: (args) => (
    <EventInfoWidgetSkeleton {...args} />
  )
} as Meta<typeof EventInfoWidgetSkeleton>;

export const Base: StoryObj<EventInfoWidgetSkeleton> = {};
