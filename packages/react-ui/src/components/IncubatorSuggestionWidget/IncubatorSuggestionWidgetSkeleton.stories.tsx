import type { Meta, StoryObj } from '@storybook/react';
import IncubatorSuggestionWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/IncubatorSuggestionWidget',
  component: IncubatorSuggestionWidgetSkeleton
} as Meta<typeof IncubatorSuggestionWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 500}}>
    <IncubatorSuggestionWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<IncubatorSuggestionWidgetSkeleton> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};