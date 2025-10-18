import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LessonCommentObjectsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/LessonCommentObjectsSkeleton',
  component: LessonCommentObjectsSkeleton,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    CommentObjectSkeletonProps: {
      elevation: 0,
      WidgetProps: {
        elevation: 0,
        variant: 'elevation'
      }
    }
  }
} as Meta<typeof LessonCommentObjectsSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <LessonCommentObjectsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof LessonCommentObjectsSkeleton> = {
  render: template
};

