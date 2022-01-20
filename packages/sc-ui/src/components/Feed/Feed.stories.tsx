import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Feed from './index';
import {Endpoints} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Feed',
  component: Feed
} as ComponentMeta<typeof Feed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Feed> = (args) => (
  <div style={{width: '100%', height: '500px'}}>
    <Feed {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {
  endpoint: Endpoints.MainFeed
};

export const Explore = Template.bind({});

Explore.args = {
  endpoint: Endpoints.ExploreFeed
};
