import type { Meta, StoryObj } from '@storybook/react';
import IncubatorSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Incubator',
  component: IncubatorSkeleton
} as Meta<typeof IncubatorSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <IncubatorSkeleton {...args} />
  </div>
);

export const Base: StoryObj<IncubatorSkeleton> = {
  args: {
    contained: true
  },
  render: template
};