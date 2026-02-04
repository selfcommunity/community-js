import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupsSkeleton, { GroupsSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Groups',
  component: GroupsSkeleton
} as Meta<typeof GroupsSkeleton>;

const template = (args: GroupsSkeletonProps) => (
  <div>
    <GroupsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupsSkeleton> = {
  render: template
};

