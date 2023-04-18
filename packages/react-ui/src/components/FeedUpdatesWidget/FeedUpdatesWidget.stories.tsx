import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import FeedUpdatesWidget from './index';
import {SCNotificationTopicType} from '@selfcommunity/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Feed Updates Widget',
  component: FeedUpdatesWidget
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FeedUpdatesWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedUpdatesWidget> = (args) => (
  <div style={{width: 400}}>
    <FeedUpdatesWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  subscriptionChannel: SCNotificationTopicType.INTERACTION
};
