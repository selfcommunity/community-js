import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageThreadSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageThread',
  component: PrivateMessageThreadSkeleton
} as Meta<typeof PrivateMessageThreadSkeleton>;

const template = (args: any) => (
  <div style={{maxWidth: 600}}>
    <PrivateMessageThreadSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof PrivateMessageThreadSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
