import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupRequestsWidgetSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/Group Requests Widget',
  component: GroupRequestsWidgetSkeleton
} as Meta<typeof GroupRequestsWidgetSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <GroupRequestsWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupRequestsWidgetSkeleton> = {
  render: template
};

