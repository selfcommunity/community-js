import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountReset, { AccountResetProps } from './index';

export default {
  title: 'Design System/React UI/Account Reset',
  component: AccountReset
} as Meta<typeof AccountReset>;

const template = (args: AccountResetProps) => (
  <div style={{width: 400}}>
    <AccountReset {...args} />
  </div>
);

export const Base: StoryObj<typeof AccountReset> = {
  args: {
    validationCode: ''
  },
  render: template
};

export const ValidCode: StoryObj<typeof AccountReset> = {
  args: {
    validationCode: 'e35a766ad2fa750e45509b97ee4283878c1'
  },
  render: template
};
