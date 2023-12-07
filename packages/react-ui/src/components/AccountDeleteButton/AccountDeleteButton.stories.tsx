import type { Meta, StoryObj } from '@storybook/react';
import AccountDeleteButton from './index';

export default {
  title: 'Design System/React UI/Account Delete Button ',
  component: AccountDeleteButton,
} as Meta<typeof AccountDeleteButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <AccountDeleteButton {...args} />
  </div>
);

export const Base: StoryObj<AccountDeleteButton> = {
  args: {
    contributionId: 1171,
    contributionType: 'post',
    size: 'medium'
  },
  render: template
};