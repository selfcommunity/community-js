import type { Meta, StoryObj } from '@storybook/react';
import CommentObject from './index';
import { SCContributionType } from '@selfcommunity/types';

export default {
  title: 'Design System/React UI/CommentObject',
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
    commentObjectId: 995,
    feedObjectType: SCContributionType.POST,
    feedObjectId: 392,
    variant: 'outlined'
  }

} as Meta<typeof CommentObject>;

const template = (args) => (
  <div style={{width: 500}}>
    <CommentObject {...args} />
  </div>
);

export const Base: StoryObj<CommentObject> = {
  render: template
};
