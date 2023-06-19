import type { Meta, StoryObj } from '@storybook/react';
import NotificationSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Notification',
  component: NotificationSkeleton
} as Meta<typeof NotificationSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <NotificationSkeleton {...args} />
  </div>
);

export const Base: StoryObj<NotificationSkeleton> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
