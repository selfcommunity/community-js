import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountRecover, { AccountRecoverProps } from './index';

export default {
  title: 'Design System/React UI/Account Recover',
  component: AccountRecover
} as Meta<typeof AccountRecover>;

const template = (args: AccountRecoverProps) => (
  <div style={{width: 400}}>
    <AccountRecover {...args} />
  </div>
);

export const Base: StoryObj<typeof AccountRecover> = {
  render: template
};