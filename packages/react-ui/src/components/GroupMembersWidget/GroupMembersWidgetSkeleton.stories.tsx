import type { Meta, StoryObj } from '@storybook/react';
import GroupMembersWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Group Members Widget',
  component: GroupMembersWidgetSkeleton
} as Meta<typeof GroupMembersWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupMembersWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GroupMembersWidgetSkeleton> = {
  render: template
};

