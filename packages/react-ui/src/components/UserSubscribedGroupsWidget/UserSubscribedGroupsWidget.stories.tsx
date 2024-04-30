import type { Meta, StoryObj } from '@storybook/react';
import UserSubscribedGroupsWidget from './UserSubscribedGroupsWidget';

export default {
  title: 'Design System/React UI/User Subscribed Groups Widget',
  component: UserSubscribedGroupsWidget,
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
} as Meta<typeof UserSubscribedGroupsWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserSubscribedGroupsWidget {...args} />
  </div>
);

export const Base: StoryObj<UserSubscribedGroupsWidget> = {
  args: {
    userId: 9
  },
  render: template
};