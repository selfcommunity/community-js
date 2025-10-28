import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserProfileEditSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile Edit',
  component: UserProfileEditSkeleton,
} as Meta<typeof UserProfileEditSkeleton>;

const template = () => (
  <div style={{width: '100%'}}>
    <UserProfileEditSkeleton />
  </div>
);

export const Base: StoryObj<typeof UserProfileEditSkeleton> = {
  render: template
};
