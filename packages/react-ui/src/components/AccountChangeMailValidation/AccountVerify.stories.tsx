import type { Meta, StoryObj } from '@storybook/react';
import AccountChangeMailValidation from './index';

export default {
  title: 'Design System/React UI/Account Change Mail Validation',
  component: AccountChangeMailValidation
} as Meta<typeof AccountChangeMailValidation>;

const template = (args) => (
  <div style={{width: 400}}>
    <AccountChangeMailValidation {...args} />
  </div>
);

export const Base: StoryObj<AccountChangeMailValidation> = {
  args: {
    validationCode: '',
    userId: 0,
    newMail: ''
  },
  render: template
};
