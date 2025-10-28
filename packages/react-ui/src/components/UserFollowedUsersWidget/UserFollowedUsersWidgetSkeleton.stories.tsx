import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserFollowedUsersWidgetSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/User Followed Users Widget',
  component: UserFollowedUsersWidgetSkeleton
} as Meta<typeof UserFollowedUsersWidgetSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <UserFollowedUsersWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserFollowedUsersWidgetSkeleton> = {
  render: template
};
