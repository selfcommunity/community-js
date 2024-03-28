import type { Meta, StoryObj } from '@storybook/react';
import GroupsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Groups',
  component: GroupsSkeleton
} as Meta<typeof GroupsSkeleton>;

const template = (args) => (
  <div>
    <GroupsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GroupsSkeleton> = {
  render: template
};

