import type { Meta, StoryObj } from '@storybook/react';
import MyEventsWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/My Events Widget',
  component: MyEventsWidgetSkeleton,
  render: (args) => (
    <MyEventsWidgetSkeleton {...args} />
  )
} as Meta<typeof MyEventsWidgetSkeleton>;


export const Base: StoryObj<MyEventsWidgetSkeleton> = {};