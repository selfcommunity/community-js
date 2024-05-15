import type { Meta, StoryObj } from '@storybook/react';
import GroupHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Group Header',
  component: GroupHeaderSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof GroupHeaderSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <GroupHeaderSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupHeaderSkeleton> = {
  render: template
};
