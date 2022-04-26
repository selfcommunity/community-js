import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjectDetailTemplate from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Feed Object Detail',
  component: FeedObjectDetailTemplate
} as ComponentMeta<typeof FeedObjectDetailTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjectDetailTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectDetailTemplate {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {
  feedObjectId: 344,
  feedObjectType: SCFeedObjectTypologyType.POST
};
