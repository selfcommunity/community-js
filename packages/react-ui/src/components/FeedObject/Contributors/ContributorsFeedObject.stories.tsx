import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import ContributorsFeedObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/ContributorsFeedObject',
  component: ContributorsFeedObject,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 17}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  },
  args: {
    feedObjectId: 17,
    feedObjectType: SCFeedObjectTypologyType.DISCUSSION
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ContributorsFeedObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContributorsFeedObject> = (args) => (
  <div style={{width: 800}}>
    <ContributorsFeedObject {...args} />
  </div>
);

export const Preview = Template.bind({});

Preview.args = {};
