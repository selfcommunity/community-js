import type { Meta, StoryObj } from '@storybook/react-webpack5';
import FeedSkeleton, { FeedSkeletonProps } from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Feed',
  component: FeedSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof FeedSkeleton>;

const template = (args: FeedSkeletonProps) => (
  <div style={{width: 1280}}>
    <FeedSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof FeedSkeleton> = {
  render: template
};
