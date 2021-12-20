import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import FeedObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';
import {FeedObjectTemplateType} from '../../types/feedObject';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/FeedObject',
  component: FeedObject,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 9}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    },
    template: {
      options: [FeedObjectTemplateType.SNIPPET, FeedObjectTemplateType.PREVIEW, FeedObjectTemplateType.DETAIL],
      control: {type: 'select'},
      description: 'Object template. Used only with args id.',
      table: {defaultValue: {summary: FeedObjectTemplateType.SNIPPET}}
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
    feedObjectId: 9,
    feedObjectType: SCFeedObjectTypologyType.DISCUSSION,
    template: FeedObjectTemplateType.SNIPPET,
    elevation: 1,
    variant: 'elevation'
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FeedObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObject> = (args) => (
  <div style={{width: '100%', maxWidth: 800}}>
    <FeedObject {...args} />
  </div>
);

export const Preview = Template.bind({});

Preview.args = {
  template: FeedObjectTemplateType.PREVIEW
};

export const Snippet = Template.bind({});

Snippet.args = {
  template: FeedObjectTemplateType.SNIPPET
};

export const Detail = Template.bind({});

Detail.args = {
  template: FeedObjectTemplateType.DETAIL
};
