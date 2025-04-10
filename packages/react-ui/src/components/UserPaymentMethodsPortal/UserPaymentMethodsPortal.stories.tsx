import type { Meta, StoryObj } from '@storybook/react';
import UserPaymentMethodsPortal from './index';

export default {
  title: 'Design System/React UI/Payments/UserPaymentMethodsPortal',
  component: UserPaymentMethodsPortal,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  }
} as Meta<typeof UserPaymentMethodsPortal>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserPaymentMethodsPortal {...args} />
  </div>
);

export const Base: StoryObj<typeof UserPaymentMethodsPortal> = {
  args: {
		onHandleCustomerPortal: (url) => console.log(url),
	},
  render: template
};
