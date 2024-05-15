import type { Meta, StoryObj } from '@storybook/react';
import GroupRequestsWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Group Requests Widget',
  component: GroupRequestsWidgetSkeleton
} as Meta<typeof GroupRequestsWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupRequestsWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GroupRequestsWidgetSkeleton> = {
  render: template
};

