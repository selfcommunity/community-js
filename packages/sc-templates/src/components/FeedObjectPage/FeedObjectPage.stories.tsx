import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjectPage from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/FeedObject Page',
  component: FeedObjectPage
} as ComponentMeta<typeof FeedObjectPage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjectPage> = (args) => (
  <div style={{ maxWidth: '1200px', width: '100%', height: '500px' }}>
    <FeedObjectPage {...args} />
  </div>
);

export const Page = Template.bind({});

Page.args = {
  feedObjectId: 9,
  feedObjectType: SCFeedObjectTypologyType.DISCUSSION
};
