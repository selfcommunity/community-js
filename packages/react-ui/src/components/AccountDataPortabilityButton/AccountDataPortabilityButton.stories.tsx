import type { Meta, StoryObj } from '@storybook/react';
import AccountDataPortabilityButton from './index';

export default {
  title: 'Design System/React UI/Account Data Portability Button ',
  component: AccountDataPortabilityButton,
} as Meta<typeof AccountDataPortabilityButton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <AccountDataPortabilityButton {...args} />
  </div>
);

export const Base: StoryObj<AccountDataPortabilityButton> = {
  args: {
    contributionId: 1171,
    contributionType: 'post',
    size: 'medium'
  },
  render: template
};
