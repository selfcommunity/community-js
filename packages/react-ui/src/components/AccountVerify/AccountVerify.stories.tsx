import type { Meta, StoryObj } from '@storybook/react';
import AccountVerify from './index';

export default {
  title: 'Design System/React UI/Account Verify',
  component: AccountVerify
} as Meta<typeof AccountVerify>;

const template = (args) => (
  <div style={{width: 400}}>
    <AccountVerify {...args} />
  </div>
);

export const Base: StoryObj<AccountVerify> = {
  args: {
    validationCode: ''
  },
  render: template
};
