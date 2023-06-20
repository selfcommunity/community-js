import type { Meta, StoryObj } from '@storybook/react';
import DateTimeAgo from './index';

export default {
  title: 'Design System/React UI Shared/DateTimeAgo',
  component: DateTimeAgo,
  argTypes: {
    date: {
      control: {type: 'date'},
      description: 'Date',
      table: {defaultValue: {summary: new Date()}}
    },
    live: {
      control: {type: 'boolean'},
      description: 'Live update',
      table: {defaultValue: {summary: true}}
    }
  }
} as Meta<typeof DateTimeAgo>;

const template = (args) => <DateTimeAgo {...args} />;

export const Base: StoryObj<DateTimeAgo> = {
  args: {
    date: new Date(),
    live: true
  },
  render: template
};