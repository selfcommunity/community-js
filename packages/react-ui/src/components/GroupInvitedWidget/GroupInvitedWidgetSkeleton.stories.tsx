import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupInvitedWidgetSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/Group Invited Widget',
  component: GroupInvitedWidgetSkeleton
} as Meta<typeof GroupInvitedWidgetSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <GroupInvitedWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupInvitedWidgetSkeleton> = {
  render: template
};

