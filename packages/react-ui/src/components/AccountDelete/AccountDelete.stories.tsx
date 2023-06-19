import type { Meta, StoryObj } from '@storybook/react';
import AccountDelete from './AccountDelete';

export default {
  title: 'Design System/React UI/Account Delete',
  component: AccountDelete
} as Meta<typeof AccountDelete>;

const template = (args) => (
  <div style={{width: 600}}>
    <AccountDelete {...args} />
  </div>
);

export const Base: StoryObj<AccountDelete> = {
  render: template
};
