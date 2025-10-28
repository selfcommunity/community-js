import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountChangeMailValidation, { AccountChangeMailValidationProps } from './index';

export default {
  title: 'Design System/React UI/Account Change Mail Validation',
  component: AccountChangeMailValidation
} as Meta<typeof AccountChangeMailValidation>;

const template = (args: AccountChangeMailValidationProps) => (
  <div style={{width: 400}}>
    <AccountChangeMailValidation {...args} />
  </div>
);

export const Base: StoryObj<typeof AccountChangeMailValidation> = {
  args: {
    validationCode: '',
    userId: 0,
		newEmail: ''
  },
  render: template
};
