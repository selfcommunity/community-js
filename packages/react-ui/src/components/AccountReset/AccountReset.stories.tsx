import type { Meta, StoryObj } from '@storybook/react';
import AccountReset from './index';

export default {
  title: 'Design System/React UI/Account Reset',
  component: AccountReset
} as Meta<typeof AccountReset>;

const template = (args) => (
  <div style={{width: 400}}>
    <AccountReset {...args} />
  </div>
);

export const Base: StoryObj<AccountReset> = {
  args: {
    validationCode: ''
  },
  render: template
};

export const ValidCode: StoryObj<AccountReset> = {
  args: {
    validationCode: 'e35a766ad2fa750e45509b97ee4283878c1'
  },
  render: template
};
