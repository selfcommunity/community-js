import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CreateEventWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Create Event Widget',
  component: CreateEventWidgetSkeleton,
  render: (args) => (
    <CreateEventWidgetSkeleton {...args} />
  )
} as Meta<typeof CreateEventWidgetSkeleton>;

export const Base: StoryObj<CreateEventWidgetSkeleton> = {};