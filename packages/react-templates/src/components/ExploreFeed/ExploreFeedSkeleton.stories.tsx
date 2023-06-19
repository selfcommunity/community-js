import type { Meta, StoryObj } from '@storybook/react';
import ExploreFeedSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Explore Feed',
  component: ExploreFeedSkeletonTemplate
} as Meta<typeof ExploreFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: StoryObj<typeof ExploreFeedSkeletonTemplate> = {render: (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <ExploreFeedSkeletonTemplate {...args} />
  </div>
)};

