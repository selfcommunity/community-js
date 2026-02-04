import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserPaymentMethodsSkeleton, { UserPaymentMethodsSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/UserPaymentMethods',
  component: UserPaymentMethodsSkeleton
} as Meta<typeof UserPaymentMethodsSkeleton>;

const template = (args: UserPaymentMethodsSkeletonProps) => (
  <div style={{width: '100%'}}>
    <UserPaymentMethodsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserPaymentMethodsSkeleton> = {
  render: template
};
