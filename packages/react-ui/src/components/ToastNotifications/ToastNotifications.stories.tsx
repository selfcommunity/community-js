import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ToastNotifications, { ToastNotificationsProps } from './index';

export default {
  title: 'Design System/React UI/ToastNotifications',
  component: ToastNotifications,
} as Meta<typeof ToastNotifications>;


const template = (args: ToastNotificationsProps) => <ToastNotifications {...args} />;

export const Base: StoryObj<typeof ToastNotifications> = {
  render: template
};
