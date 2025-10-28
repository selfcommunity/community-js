import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CommentsObjectSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CommentsObjectSkeleton',
  component: CommentsObjectSkeleton,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {
    CommentObjectSkeletonProps: {
      elevation: 0,
      WidgetProps: {
        elevation: 1,
        variant: 'elevation'
      }
    }
  }
} as Meta<typeof CommentsObjectSkeleton>;

const template = (args: any) => (
  <div style={{width: 400}}>
    <CommentsObjectSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof CommentsObjectSkeleton> = {
  render: template
};

