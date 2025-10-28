import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserConnectionsRequestsSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/User Connections Requests Widget',
  component: UserConnectionsRequestsSkeleton
} as Meta<typeof UserConnectionsRequestsSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserConnectionsRequestsSkeleton> = {
  render: template
};
