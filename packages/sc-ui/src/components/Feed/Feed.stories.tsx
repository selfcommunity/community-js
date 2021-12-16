import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Feed from './index';
import { SCFeedTypologyType } from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Feed',
  component: Feed,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof Feed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Feed> = (args) => (
  <div style={{width: '100%', height: '500px'}}>
    <Feed {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {
  type: SCFeedTypologyType.MAIN
};

export const Explore = Template.bind({});

Explore.args = {
  type: SCFeedTypologyType.EXPLORE
};
