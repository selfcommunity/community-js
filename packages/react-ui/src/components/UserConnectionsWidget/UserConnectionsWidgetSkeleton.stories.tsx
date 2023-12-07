import type { Meta, StoryObj } from '@storybook/react';
import UserConnectionsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Connections Widget',
  component: UserConnectionsSkeleton
} as Meta<typeof UserConnectionsSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserConnectionsSkeleton> = {
  render: template
};