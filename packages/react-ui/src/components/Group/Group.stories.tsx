import type { Meta, StoryObj } from '@storybook/react';
import Group from './index';

export default {
  title: 'Design System/React UI/Group',
  component: Group,
  argTypes: {
    groupId: {
      control: {type: 'number'},
      description: 'Group Id',
      table: {defaultValue: {summary: 1}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
} as Meta<typeof Group>;

const template = (args) => (
  <div style={{width: 400}}>
    <Group {...args} />
  </div>
);

export const Base: StoryObj<Group> = {
  args: {
    groupId: 1,
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};

