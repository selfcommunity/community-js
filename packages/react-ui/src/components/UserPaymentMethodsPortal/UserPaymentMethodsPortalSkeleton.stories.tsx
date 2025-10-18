import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserPaymentMethodsPortalSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/UserPaymentMethodsPortal',
  component: UserPaymentMethodsPortalSkeleton
} as Meta<typeof UserPaymentMethodsPortalSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserPaymentMethodsPortalSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserPaymentMethodsPortalSkeleton> = {
  render: template
};
