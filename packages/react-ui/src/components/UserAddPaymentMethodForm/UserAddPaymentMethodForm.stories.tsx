import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserAddPaymentMethodForm from './index';

export default {
  title: 'Design System/React UI/Payments/UserAddPaymentMethodForm',
  component: UserAddPaymentMethodForm,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  }
} as Meta<typeof UserAddPaymentMethodForm>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserAddPaymentMethodForm {...args} />
  </div>
);

export const Base: StoryObj<typeof UserAddPaymentMethodForm> = {
  args: {},
  render: template
};
