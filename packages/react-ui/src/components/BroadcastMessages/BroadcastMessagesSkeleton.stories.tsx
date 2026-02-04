import type { Meta, StoryObj } from '@storybook/react-webpack5';
import BroadcastMessagesSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Broadcast Messages',
  component: BroadcastMessagesSkeleton
} as Meta<typeof BroadcastMessagesSkeleton>;

const template = (args: any) => (
  <div style={{width: 400}}>
    <BroadcastMessagesSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof BroadcastMessagesSkeleton> = {
  render: template
};