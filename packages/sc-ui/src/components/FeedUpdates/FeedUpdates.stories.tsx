import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import FeedUpdates from './index';
import {SCNotificationTopicType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Feed Updates',
  component: FeedUpdates
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FeedUpdates>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedUpdates> = (args) => (
  <div style={{width: 400}}>
    <FeedUpdates {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  subscriptionChannel: SCNotificationTopicType.INTERACTION
};
