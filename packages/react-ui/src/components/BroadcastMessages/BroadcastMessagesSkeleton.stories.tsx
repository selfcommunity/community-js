import type { Meta, StoryObj } from '@storybook/react';
import BroadcastMessagesSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Broadcast Messages',
  component: BroadcastMessagesSkeleton
} as Meta<typeof BroadcastMessagesSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <BroadcastMessagesSkeleton {...args} />
  </div>
);

export const Base: StoryObj<BroadcastMessagesSkeleton> = {
  render: template
};