import type { Meta, StoryObj } from '@storybook/react';
import UserFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/User Feed',
  component: UserFeedSkeletonTemplate
} as Meta<typeof UserFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof UserFeedSkeletonTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <UserFeedSkeletonTemplate {...args} />
    </div>
  )
};
