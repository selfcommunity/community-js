import type { Meta, StoryObj } from '@storybook/react';
import GroupFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Group Feed',
  component: GroupFeedSkeletonTemplate
} as Meta<typeof GroupFeedSkeletonTemplate>;

export const Base: StoryObj<typeof GroupFeedSkeletonTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <GroupFeedSkeletonTemplate {...args} />
    </div>
  )
};