import type { Meta, StoryObj } from '@storybook/react';
import IncubatorListWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/IncubatorListWidget',
  component: IncubatorListWidgetSkeleton
} as Meta<typeof IncubatorListWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 500}}>
    <IncubatorListWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<IncubatorListWidgetSkeleton> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
