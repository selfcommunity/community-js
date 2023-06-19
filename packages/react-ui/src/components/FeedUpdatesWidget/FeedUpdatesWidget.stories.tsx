import type { Meta, StoryObj } from '@storybook/react';
import FeedUpdatesWidget from './index';
import {SCNotificationTopicType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/Feed Updates Widget',
  component: FeedUpdatesWidget
} as Meta<typeof FeedUpdatesWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <FeedUpdatesWidget {...args} />
  </div>
);

export const Base: StoryObj<FeedUpdatesWidget> = {
  args: {
    subscriptionChannel: SCNotificationTopicType.INTERACTION
  },
  render: template
};
