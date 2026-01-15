import type { Meta, StoryObj } from '@storybook/react-webpack5';
import FeedUpdatesWidget, { FeedUpdatesWidgetProps } from './index';
import {SCNotificationTopicType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/Feed Updates Widget',
  component: FeedUpdatesWidget
} as Meta<typeof FeedUpdatesWidget>;

const template = (args: FeedUpdatesWidgetProps) => (
  <div style={{width: 400}}>
    <FeedUpdatesWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof FeedUpdatesWidget> = {
  args: {
    subscriptionChannel: SCNotificationTopicType.INTERACTION
  },
  render: template
};
