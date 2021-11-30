import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import FeedObject, {FeedObjectComponentType} from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/FeedObject',
  component: FeedObject,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 7604}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    },
    type: {
      options: [FeedObjectComponentType.SNIPPET, FeedObjectComponentType.PREVIEW, FeedObjectComponentType.DETAIL],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.',
      table: {defaultValue: {summary: FeedObjectComponentType.SNIPPET}}
    },
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
    id: 7604,
    type: FeedObjectComponentType.SNIPPET,
    elevation: 1,
    variant: 'elevation'
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FeedObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObject> = (args) => (
  <div style={{width: 800}}>
    <FeedObject {...args} />
  </div>
);

export const Preview = Template.bind({});

Preview.args = {
  type: FeedObjectComponentType.PREVIEW
};

export const Snippet = Template.bind({});

Snippet.args = {
  type: FeedObjectComponentType.SNIPPET
};

export const Detail = Template.bind({});

Detail.args = {
  type: FeedObjectComponentType.DETAIL
};
