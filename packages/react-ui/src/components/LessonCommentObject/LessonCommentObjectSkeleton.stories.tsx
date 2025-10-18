import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LessonCommentObjectSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/LessonCommentObject',
  component: LessonCommentObjectSkeleton,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    elevation: 0,
    WidgetProps: {
      elevation: 0
    }
  }
} as Meta<typeof LessonCommentObjectSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <LessonCommentObjectSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof LessonCommentObjectSkeleton> = {
  render: template
};

