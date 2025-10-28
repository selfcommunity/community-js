import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LessonCommentObject, { LessonCommentObjectProps } from './index';

export default {
  title: 'Design System/React UI/LessonCommentObject',
  component: LessonCommentObject,
  argTypes: {
    commentObjectId: {
      control: {type: 'number'},
      description: 'LessonCommentObject Id',
      table: {defaultValue: {summary: '1'}}
    },
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
    // commentObjectId: 995,
    // feedObjectType: SCContributionType.POST,
    // feedObjectId: 392,
    // variant: 'outlined'
  }

} as Meta<typeof LessonCommentObject>;

const template = (args: LessonCommentObjectProps) => (
  <div style={{width: 500}}>
    <LessonCommentObject {...args} />
  </div>
);

export const Base: StoryObj<typeof LessonCommentObject> = {
  render: template
};
