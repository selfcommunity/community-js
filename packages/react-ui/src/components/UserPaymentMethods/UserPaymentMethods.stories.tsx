import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserPaymentMethods, { UserPaymentMethodsProps } from './index';

export default {
  title: 'Design System/React UI/Payments/UserPaymentMethods',
  component: UserPaymentMethods,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: '7'}}
    }
  }
} as Meta<typeof UserPaymentMethods>;

const template = (args: UserPaymentMethodsProps) => (
  <div style={{width: '100%'}}>
    <UserPaymentMethods {...args} />
  </div>
);

export const Base: StoryObj<typeof UserPaymentMethods> = {
  render: template
};
