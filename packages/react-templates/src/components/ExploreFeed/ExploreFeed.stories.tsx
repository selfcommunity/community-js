import type { Meta, StoryObj } from '@storybook/react';
import ExploreFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Explore Feed',
  component: ExploreFeedTemplate
} as Meta<typeof ExploreFeedTemplate>;

export const Base: StoryObj<typeof ExploreFeedTemplate> = {render: (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <ExploreFeedTemplate {...args} />
  </div>
)};