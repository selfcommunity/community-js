import type { Meta, StoryObj } from '@storybook/react';
import ToastNotificationsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/ToastNotifications',
  component: ToastNotificationsSkeleton
} as Meta<typeof ToastNotificationsSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <ToastNotificationsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<ToastNotificationsSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
