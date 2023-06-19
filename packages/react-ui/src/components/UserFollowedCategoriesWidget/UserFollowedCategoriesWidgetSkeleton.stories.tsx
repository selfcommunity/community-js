import type { Meta, StoryObj } from '@storybook/react';
import UserFollowedCategoriesWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Followed Categories Widget',
  component: UserFollowedCategoriesWidgetSkeleton,
  argTypes: {
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof UserFollowedCategoriesWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserFollowedCategoriesWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<UserFollowedCategoriesWidgetSkeleton> = {
  render: template
};