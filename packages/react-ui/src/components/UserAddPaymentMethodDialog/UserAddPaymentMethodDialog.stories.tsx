import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserAddPaymentMethodDialog from './index';

export default {
  title: 'Design System/React UI/Payments/UserAddPaymentMethodDialog',
  component: UserAddPaymentMethodDialog,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  }
} as Meta<typeof UserAddPaymentMethodDialog>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserAddPaymentMethodDialog {...args} />
  </div>
);

export const Base: StoryObj<typeof UserAddPaymentMethodDialog> = {
  args: {},
  render: template
};
