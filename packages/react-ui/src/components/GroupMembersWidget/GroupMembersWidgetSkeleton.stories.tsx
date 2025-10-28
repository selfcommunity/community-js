import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupMembersWidgetSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/Group Members Widget',
  component: GroupMembersWidgetSkeleton
} as Meta<typeof GroupMembersWidgetSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <GroupMembersWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupMembersWidgetSkeleton> = {
  render: template
};

