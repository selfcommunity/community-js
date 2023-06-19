import type { Meta, StoryObj } from '@storybook/react';
import NotificationFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Notification Feed',
  component: NotificationFeedSkeletonTemplate
} as Meta<typeof NotificationFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof NotificationFeedSkeletonTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <NotificationFeedSkeletonTemplate {...args} />
    </div>)
};
