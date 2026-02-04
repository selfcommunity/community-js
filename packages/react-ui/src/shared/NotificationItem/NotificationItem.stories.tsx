import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NotificationItem, { NotificationItemProps } from './index';

export default {
  title: 'Design System/React UI Shared/NotificationItem',
  component: NotificationItem
} as Meta<typeof NotificationItem>;

const template = (args: NotificationItemProps) => <NotificationItem {...args} />;

export const Base: StoryObj<typeof NotificationItem> = {
  args: {
    primary: 'TITOLO',
    secondary: 'caption'
  },
  render: template
};