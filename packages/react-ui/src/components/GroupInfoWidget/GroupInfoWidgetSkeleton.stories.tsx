import type { Meta, StoryObj } from '@storybook/react';
import GroupInfoWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/GroupInfoWidget',
  component: GroupInfoWidgetSkeleton
} as Meta<typeof GroupInfoWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupInfoWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<GroupInfoWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
};
