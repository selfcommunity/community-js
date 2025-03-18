import type { Meta, StoryObj } from '@storybook/react';
import UserCreatedCoursesWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Created Courses Widget',
  component: UserCreatedCoursesWidgetSkeleton,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    elevation: 0
  }
} as Meta<typeof UserCreatedCoursesWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserCreatedCoursesWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserCreatedCoursesWidgetSkeleton> = {
  render: template
};
