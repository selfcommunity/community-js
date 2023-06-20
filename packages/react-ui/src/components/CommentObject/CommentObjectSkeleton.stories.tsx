import type { Meta, StoryObj } from '@storybook/react';
import CommentObjectSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CommentObject',
  component: CommentObjectSkeleton,
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
      elevation: 0,
      variant: 'outlined'
    }
  }
} as Meta<typeof CommentObjectSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <CommentObjectSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CommentObjectSkeleton> = {
  render: template
};

