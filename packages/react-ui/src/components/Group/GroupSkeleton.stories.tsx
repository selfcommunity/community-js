import type { Meta, StoryObj } from '@storybook/react';
import GroupSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Group',
  component: GroupSkeleton
} as Meta<typeof GroupSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GroupSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
