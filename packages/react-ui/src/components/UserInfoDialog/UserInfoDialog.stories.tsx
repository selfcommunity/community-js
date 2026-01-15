import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserInfoDialog, { UserInfoDialogProps } from './index';

export default {
  title: 'Design System/React UI/User Info Dialog',
  component: UserInfoDialog
} as Meta<typeof UserInfoDialog>;

const template = (args: UserInfoDialogProps) => (
  <div style={{width: 400}}>
    <UserInfoDialog {...args} />
  </div>
);

export const Base: StoryObj<typeof UserInfoDialog> = {
  args: {
    open: true,
    userId: 1,
    onClose: () => null
  },
  render: template
};