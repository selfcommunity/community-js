import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NotificationFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Notification Feed',
  component: NotificationFeedSkeletonTemplate
} as Meta<typeof NotificationFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof NotificationFeedSkeletonTemplate> = {
  render: () => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <NotificationFeedSkeletonTemplate />
    </div>
    )
};
