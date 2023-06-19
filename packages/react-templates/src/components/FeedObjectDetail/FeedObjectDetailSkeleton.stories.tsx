import type { Meta, StoryObj } from '@storybook/react';
import FeedObjectDetailSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Feed Object Detail',
  component: FeedObjectDetailSkeletonTemplate
} as Meta<typeof FeedObjectDetailSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof FeedObjectDetailSkeletonTemplate> = {render: (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectDetailSkeletonTemplate {...args} />
  </div>
)};
