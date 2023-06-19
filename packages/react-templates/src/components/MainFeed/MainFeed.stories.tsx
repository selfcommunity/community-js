import type { Meta, StoryObj } from '@storybook/react';
import MainFeedTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Main Feed',
  component: MainFeedTemplate,
} as Meta<typeof MainFeedTemplate>;

export const Base: StoryObj<typeof MainFeedTemplate> = {
  render: (args) => (
    <div style={{ maxWidth: '1200px', width: '100%', height: '500px' }}>
      <MainFeedTemplate {...args} />
    </div>)
};
