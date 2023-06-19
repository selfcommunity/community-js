import type { Meta, StoryObj } from '@storybook/react';
import CommentsFeedObject from './index';
import { SCCommentsOrderBy } from '../../types/comments';
import { SCContributionType } from '@selfcommunity/types';

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
      options: [SCContributionType.POST, SCContributionType.DISCUSSION, SCContributionType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.',
      table: {defaultValue: {summary: SCContributionType.POST}}
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
    feedObjectType: SCContributionType.POST,
    infiniteScrolling: true,
    commentsOrderBy: SCCommentsOrderBy.ADDED_AT_ASC,
    showTitle: true,
    // onChangePage: (p) => console.log(p),
    // page: 2
  }
  
} as Meta<typeof CommentsFeedObject>;

const template = (args) => (
  <div style={{width: '100%', maxWidth: 800}}>
    <CommentsFeedObject {...args} />
  </div>
);

export const Base: StoryObj<CommentsFeedObject> = {
  args: {
    CommentObjectSkeletonProps: {elevation: 0, WidgetProps: {variant: 'outlined'}},
    CommentComponentProps: {
      CommentObjectReplyProps: {elevation: 0, WidgetProps: {elevation: 0, variant: 'outlined'}},
      variant: 'outlined'
    }
  },
  render: template
};

export const CommentFirstLevel: StoryObj<CommentsFeedObject> = {
  args: {
    commentObjectId: 1146
  },
  render: template
};

export const CommentSecondLevel: StoryObj<CommentsFeedObject> = {
  args: {
    commentObjectId: 1119
  },
  render: template
};
