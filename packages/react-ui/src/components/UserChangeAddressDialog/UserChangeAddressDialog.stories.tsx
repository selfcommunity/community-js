import type { Meta, StoryObj } from '@storybook/react';
import UserChangeAddressDialog from './index';

export default {
  title: 'Design System/React UI/Payments/UserChangeAddressDialog',
  component: UserChangeAddressDialog,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  }
} as Meta<typeof UserChangeAddressDialog>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserChangeAddressDialog {...args} />
  </div>
);

export const Base: StoryObj<typeof UserChangeAddressDialog> = {
  args: {},
  render: template
};
