import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserConnectionsSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/User Connections Widget',
  component: UserConnectionsSkeleton
} as Meta<typeof UserConnectionsSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <UserConnectionsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserConnectionsSkeleton> = {
  render: template
};