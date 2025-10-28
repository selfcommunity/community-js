import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountVerify, { AccountVerifyProps } from './index';

export default {
  title: 'Design System/React UI/Account Verify',
  component: AccountVerify
} as Meta<typeof AccountVerify>;

const template = (args: AccountVerifyProps) => (
  <div style={{width: 400}}>
    <AccountVerify {...args} />
  </div>
);

export const Base: StoryObj<typeof AccountVerify> = {
  args: {
    validationCode: ''
  },
  render: template
};
