import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CommentObjectReply, { CommentObjectReplyProps } from './index';

export default {
  title: 'Design System/React UI/Comment Object Reply',
  component: CommentObjectReply,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: '1'}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    variant: 'outlined'
  }
} as Meta<typeof CommentObjectReply>;


const template = (args: CommentObjectReplyProps) => (
  <div style={{width: 500}}>
    <CommentObjectReply {...args} />
  </div>
);

export const Base: StoryObj<typeof CommentObjectReply> = {
  args: {
    onSave: undefined,
    onReply: (comment) => console.log(comment)
  },
  render: template
};
