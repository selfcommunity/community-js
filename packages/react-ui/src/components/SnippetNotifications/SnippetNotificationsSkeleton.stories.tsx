import type { Meta, StoryObj } from '@storybook/react';
import NotificationPopupSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/NotificationPopup',
  component: NotificationPopupSkeleton,
} as Meta<typeof NotificationPopupSkeleton>;

const template = (args) => (
  <div style={{width: 280}}>
    <NotificationPopupSkeleton {...args} />
  </div>
);

export const Base: StoryObj<NotificationPopupSkeleton> = {
  render: template
};
