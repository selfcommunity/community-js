import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/Group',
  component: GroupSkeleton
} as Meta<typeof GroupSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <GroupSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
