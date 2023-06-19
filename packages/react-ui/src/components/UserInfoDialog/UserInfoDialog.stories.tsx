import type { Meta, StoryObj } from '@storybook/react';
import UserInfoDialog from './index';

export default {
  title: 'Design System/React UI/User Info Dialog',
  component: UserInfoDialog
} as Meta<typeof UserInfoDialog>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserInfoDialog {...args}></UserInfoDialog>
  </div>
);

export const Base: StoryObj<UserInfoDialog> = {
  args: {
    open: true,
    userId: 1,
    onClose: () => null
  },
  render: template
};