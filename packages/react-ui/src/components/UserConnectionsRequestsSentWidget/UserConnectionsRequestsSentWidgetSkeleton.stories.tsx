import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserConnectionsRequestsSentSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/User Connections Requests Sent Widget',
  component: UserConnectionsRequestsSentSkeleton
} as Meta<typeof UserConnectionsRequestsSentSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSentSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserConnectionsRequestsSentSkeleton> = {
  render: template
};