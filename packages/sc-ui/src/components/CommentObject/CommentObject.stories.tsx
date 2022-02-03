import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CommentObject from './index';
import { SCFeedObjectTypologyType } from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CommentObject',
  component: CommentObject,
  argTypes: {
    commentObjectId: {
      control: {type: 'number'},
      description: 'CommentObject Id',
      table: {defaultValue: {summary: 79}}
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
    commentObjectId: 79,
    feedObjectType: SCFeedObjectTypologyType.DISCUSSION,
    feedObjectId: 17
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentObject> = (args) => (
  <div style={{width: 500}}>
    <CommentObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
