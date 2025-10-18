import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountRecover from './index';

export default {
  title: 'Design System/React UI/Account Recover',
  component: AccountRecover
} as Meta<typeof AccountRecover>;

const template = (args) => (
  <div style={{width: 400}}>
    <AccountRecover {...args} />
  </div>
);

export const Base: StoryObj<AccountRecover> = {
  render: template
};