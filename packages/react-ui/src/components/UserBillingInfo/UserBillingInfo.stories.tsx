import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserBillingInfo, { UserBillingInfoProps } from './index';

export default {
  title: 'Design System/React UI/Payments/UserBillingInfo',
  component: UserBillingInfo,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: '7'}}
    }
  }
} as Meta<typeof UserBillingInfo>;

const template = (args: UserBillingInfoProps) => (
  <div style={{width: '100%'}}>
    <UserBillingInfo {...args} />
  </div>
);

export const Base: StoryObj<typeof UserBillingInfo> = {
  args: {},
  render: template
};
