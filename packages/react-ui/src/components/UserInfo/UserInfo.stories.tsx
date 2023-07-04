import type { Meta, StoryObj } from '@storybook/react';
import UserInfo from './index';
import { DEFAULT_FIELDS } from '../../constants/UserProfile';

export default {
  title: 'Design System/React UI/User Info ',
  component: UserInfo,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 7}}
    }
  }
} as Meta<typeof UserInfo>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <UserInfo {...args} />
  </div>
);

export const Base: StoryObj<UserInfo> = {
  args: {
    userId: 167,
    fields: [...DEFAULT_FIELDS]
  },
  render: template
};
