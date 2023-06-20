import type { Meta, StoryObj } from '@storybook/react';
import UserActionIconButton from './index';

export default {
  title: 'Design System/React UI/User Actions',
  component: UserActionIconButton,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 167}}
    }
  },
  args: {
    userId: 167
  }
} as Meta<typeof UserActionIconButton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserActionIconButton {...args} />
  </div>
);

export const Base: StoryObj<UserActionIconButton> = {
  args: {
    userId: 167
  },
  render: template
};
