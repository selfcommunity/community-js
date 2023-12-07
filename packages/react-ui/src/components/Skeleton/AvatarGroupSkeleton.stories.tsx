import type { Meta, StoryObj } from '@storybook/react';
import AvatarGroupSkeleton from './AvatarGroupSkeleton';

export default {
  title: 'Design System/React UI/Skeleton/AvatarGroup',
  component: AvatarGroupSkeleton
} as Meta<typeof AvatarGroupSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <AvatarGroupSkeleton {...args} />
  </div>
);

export const Base: StoryObj<AvatarGroupSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
