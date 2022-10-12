import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import CommentsFeedObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types';
import {SCCommentsOrderBy} from '../../types/comments';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/CommentsFeedObject',
  component: CommentsFeedObject,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 360}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.',
      table: {defaultValue: {summary: SCFeedObjectTypologyType.POST}}
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
    feedObjectId: 554,
    feedObjectType: SCFeedObjectTypologyType.POST,
    infiniteScrolling: true,
    commentsOrderBy: SCCommentsOrderBy.ADDED_AT_ASC,
    showTitle: true,
    // onChangePage: (p) => console.log(p),
    // page: 2
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentsFeedObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentsFeedObject> = (args) => (
  <div style={{width: '100%', maxWidth: 800}}>
    <CommentsFeedObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  CommentObjectSkeletonProps: {elevation: 0, WidgetProps: {variant: 'outlined'}},
  CommentComponentProps: {
    ReplyCommentObjectProps: {elevation: 0, WidgetProps: {elevation: 0, variant: 'outlined'}},
    variant: 'outlined'
  }
};

export const CommentFirstLevel = Template.bind({});

CommentFirstLevel.args = {
  commentObjectId: 1146
};

export const CommentSecondLevel = Template.bind({});

CommentSecondLevel.args = {
  commentObjectId: 1119
};
