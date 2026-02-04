import type { Meta, StoryObj } from '@storybook/react-webpack5';
import ToastNotificationsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/ToastNotifications',
  component: ToastNotificationsSkeleton
} as Meta<typeof ToastNotificationsSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <ToastNotificationsSkeleton />
  </div>
);

export const Base: StoryObj<typeof ToastNotificationsSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
