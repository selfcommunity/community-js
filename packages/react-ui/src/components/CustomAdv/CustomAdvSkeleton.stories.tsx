import type { Meta, StoryObj } from '@storybook/react';
import CustomAdvSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CustomAdv',
  component: CustomAdvSkeleton
} as Meta<typeof CustomAdvSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <CustomAdvSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CustomAdvSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
