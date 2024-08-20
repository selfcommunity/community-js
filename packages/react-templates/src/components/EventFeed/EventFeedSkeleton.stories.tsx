import type { Meta, StoryObj } from '@storybook/react';
import EventFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Event Feed',
  component: EventFeedSkeletonTemplate
} as Meta<typeof EventFeedSkeletonTemplate>;

export const Base: StoryObj<typeof EventFeedSkeletonTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <EventFeedSkeletonTemplate {...args} />
    </div>
  )
};
