import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EventMembersWidgetSkeleton } from './index';

export default {
  title: 'Design System/React UI/Skeleton/Event Members Widget',
  component: EventMembersWidgetSkeleton,
  render: (args) => (
    <EventMembersWidgetSkeleton {...args} />
  )
} as Meta<typeof EventMembersWidgetSkeleton>;


export const Base: StoryObj<typeof EventMembersWidgetSkeleton> = {};
