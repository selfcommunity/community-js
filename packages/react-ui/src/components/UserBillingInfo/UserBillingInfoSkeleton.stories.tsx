import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserBillingInfoSkeleton, { UserSkeletonBillingInfoProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/UserBillingInfo',
  component: UserBillingInfoSkeleton,
} as Meta<typeof UserBillingInfoSkeleton>;

const template = (args: UserSkeletonBillingInfoProps) => (
  <div style={{width: '100%'}}>
    <UserBillingInfoSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserBillingInfoSkeleton> = {
  render: template
};
