import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PlatformWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PlatformWidget',
  component: PlatformWidgetSkeleton
} as Meta<typeof PlatformWidgetSkeleton>;

const template = (args: any) => (
  <div style={{width: 470}}>
    <PlatformWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof PlatformWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
};
