import type { Meta, StoryObj } from '@storybook/react';
import AccountDataPortability from './AccountDataPortability';

export default {
  title: 'Design System/React UI/Account Data Portability',
  component: AccountDataPortability,
} as Meta<typeof AccountDataPortability>;

const template = (args) => (
  <div style={{width: 600}}>
    <AccountDataPortability {...args} />
  </div>
);

export const Base: StoryObj<AccountDataPortability> = {
  render: template
};
