import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageThreadItemSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageThreadItem',
  component: PrivateMessageThreadItemSkeleton
} as Meta<typeof PrivateMessageThreadItemSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageThreadItemSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageThreadItemSkeleton> = {
  args: {
    contained: true
  },
  render: template
};