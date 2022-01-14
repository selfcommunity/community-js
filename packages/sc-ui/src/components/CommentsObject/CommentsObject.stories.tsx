import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import CommentsObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';
import {CommentsOrderBy} from '../../types/comments';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CommentsObject',
  component: CommentsObject,
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
    feedObjectId: 1064, // 17,
    feedObjectType: SCFeedObjectTypologyType.POST,
    infiniteScrolling: true,
    commentsPageSize: 10,
    elevation: 1,
    variant: 'elevation',
    commentsOrderBy: CommentsOrderBy.ADDED_AT_DESC
    /* renderComment: (comment) => (
      <>
        {comment.html}
        <br />
      </>
    ) */
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentsObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentsObject> = (args) => (
  <div style={{width: '100%', maxWidth: 800}}>
    <CommentsObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};

export const CommentFirstLevel = Template.bind({});

CommentFirstLevel.args = {
  commentObjectId: 32022 // 81
};

export const CommentSecondLevel = Template.bind({});

CommentSecondLevel.args = {
  commentObjectId: 4522 // 31909
};
