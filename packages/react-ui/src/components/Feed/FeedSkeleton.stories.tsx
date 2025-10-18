import type { Meta, StoryObj } from '@storybook/react-webpack5';
import FeedSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Feed',
  component: FeedSkeleton,
  argTypes: {},
  args: {}
} as Meta<typeof FeedSkeleton>;

const template = (args) => (
  <div style={{width: 1280}}>
    <FeedSkeleton {...args} />
  </div>
);

export const Base: StoryObj<FeedSkeleton> = {
  render: template
};
