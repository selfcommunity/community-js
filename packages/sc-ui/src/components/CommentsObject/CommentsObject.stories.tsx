import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CommentsObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CommentsObject',
  component: CommentsObject,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      defaultValue: 7574,
      table: {defaultValue: {summary: 7574}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentsObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentsObject> = (args) => (
  <div style={{width: 500}}>
    <CommentsObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
};
