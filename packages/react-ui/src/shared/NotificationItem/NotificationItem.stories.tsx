import type { Meta, StoryObj } from '@storybook/react';
import NotificationItem from './index';

export default {
  title: 'Design System/React UI Shared/NotificationItem',
  component: NotificationItem
} as Meta<typeof NotificationItem>;

const template = (args) => <NotificationItem {...args} />;

export const Base: StoryObj<NotificationItem> = {
  args: {
    primary: 'TITOLO',
    secondary: 'caption'
  },
  render: template
};