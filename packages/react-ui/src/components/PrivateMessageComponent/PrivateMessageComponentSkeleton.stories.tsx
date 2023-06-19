import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageComponentSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageComponent',
  component: PrivateMessageComponentSkeleton
} as Meta<typeof PrivateMessageComponentSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageComponentSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageComponentSkeleton> = {
  args: {
    contained: true
  },
  render: template
};