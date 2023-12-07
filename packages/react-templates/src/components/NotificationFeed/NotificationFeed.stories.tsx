import type { Meta, StoryObj } from '@storybook/react';
import NotificationFeedTemplate from './index';
import { CacheStrategies } from "@selfcommunity/utils";

export default {
  title: 'Design System/React TEMPLATES/Notification Feed',
  component: NotificationFeedTemplate
} as Meta<typeof NotificationFeedTemplate>;

export const Base: StoryObj<typeof NotificationFeedTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <NotificationFeedTemplate {...args} />
    </div>)
};

export const Cached: StoryObj<typeof NotificationFeedTemplate> = {
  args: {
    FeedProps: {cacheStrategy: CacheStrategies.CACHE_FIRST}
  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <NotificationFeedTemplate {...args} />
    </div>)
};