import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserSkeleton from './Skeleton';
import { WidgetProps } from '../Widget';

export default {
  title: 'Design System/React UI/Skeleton/User',
  component: UserSkeleton
} as Meta<typeof UserSkeleton>;

const template = (args: WidgetProps) => (
  <div style={{width: 400}}>
    <UserSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
