import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserProfileHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile AppBar',
  component: UserProfileHeaderSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof UserProfileHeaderSkeleton>;

const template = () => (
  <div style={{width: '100%'}}>
    <UserProfileHeaderSkeleton />
  </div>
);

export const Base: StoryObj<typeof UserProfileHeaderSkeleton> = {
  render: template
};
