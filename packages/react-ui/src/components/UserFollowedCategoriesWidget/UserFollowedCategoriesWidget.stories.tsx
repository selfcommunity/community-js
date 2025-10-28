import type { Meta, StoryObj } from '@storybook/react-webpack5';
import UserFollowedCategoriesWidget, { UserFollowedCategoriesWidgetProps } from './UserFollowedCategoriesWidget';

export default {
  title: 'Design System/React UI/User Followed Categories Widget',
  component: UserFollowedCategoriesWidget,
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
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as Meta<typeof UserFollowedCategoriesWidget>;

const template = (args: UserFollowedCategoriesWidgetProps) => (
  <div style={{width: 400}}>
    <UserFollowedCategoriesWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof UserFollowedCategoriesWidget> = {
  args: {
    userId: 9
  },
  render: template
};