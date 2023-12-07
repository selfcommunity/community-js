import type { Meta, StoryObj } from '@storybook/react';
import PlatformWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PlatformWidget',
  component: PlatformWidgetSkeleton
} as Meta<typeof PlatformWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PlatformWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PlatformWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
};
