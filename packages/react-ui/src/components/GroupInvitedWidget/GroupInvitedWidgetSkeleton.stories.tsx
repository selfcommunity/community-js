import type { Meta, StoryObj } from '@storybook/react';
import GroupInvitedWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Group Invited Widget',
  component: GroupInvitedWidgetSkeleton
} as Meta<typeof GroupInvitedWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupInvitedWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GroupInvitedWidgetSkeleton> = {
  render: template
};

