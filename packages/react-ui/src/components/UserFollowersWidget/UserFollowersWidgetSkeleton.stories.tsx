import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserFollowersSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/User Followers Widget',
  component: UserFollowersSkeleton
} as Meta<typeof UserFollowersSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <UserFollowersSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserFollowersSkeleton> = {
  render: template
};

