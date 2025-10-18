import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ToastNotifications from './index';

export default {
  title: 'Design System/React UI/ToastNotifications',
  component: ToastNotifications,
} as Meta<typeof ToastNotifications>;


const template = (args) => <ToastNotifications {...args} />;

export const Base: StoryObj<ToastNotifications> = {
  render: template
};
