import type { Meta, StoryObj } from '@storybook/react-webpack5';
import AccountDataPortabilityButton, { AccountDataPortabilityButtonProps } from './index';

export default {
  title: 'Design System/React UI/Account Data Portability Button ',
  component: AccountDataPortabilityButton,
} as Meta<typeof AccountDataPortabilityButton>;

const template = (args: AccountDataPortabilityButtonProps) => (
  <div style={{width: '100%'}}>
    <AccountDataPortabilityButton {...args} />
  </div>
);

export const Base: StoryObj<typeof AccountDataPortabilityButton> = {
  args: {
    size: 'medium'
  },
  render: template
};
