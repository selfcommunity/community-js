import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RelatedEventsWidgetSkeleton } from './index';

export default {
  title: 'Design System/React UI/Skeleton/Related Events Widget',
  component: RelatedEventsWidgetSkeleton,
  render: (args) => (
    <RelatedEventsWidgetSkeleton {...args} />
  )
} as Meta<typeof RelatedEventsWidgetSkeleton>;


export const Base: StoryObj<typeof RelatedEventsWidgetSkeleton> = {};
