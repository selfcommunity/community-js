import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageThreadSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageThread',
  component: PrivateMessageThreadSkeleton
} as Meta<typeof PrivateMessageThreadSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageThreadSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageThreadSkeleton> = {
  args: {
    contained: true
  },
  render: template
};