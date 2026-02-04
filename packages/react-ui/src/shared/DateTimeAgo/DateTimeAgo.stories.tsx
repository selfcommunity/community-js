import type { Meta, StoryObj } from '@storybook/react-webpack5';
import DateTimeAgo, { DateTimeAgoProps } from './index';

export default {
  title: 'Design System/React UI Shared/DateTimeAgo',
  component: DateTimeAgo,
  argTypes: {
    date: {
      control: {type: 'date'},
      description: 'Date',
      table: {defaultValue: {summary: ''}}
    },
    live: {
      control: {type: 'boolean'},
      description: 'Live update',
      table: {defaultValue: {summary: ''}}
    }
  }
} as Meta<typeof DateTimeAgo>;

const template = (args: DateTimeAgoProps) => <DateTimeAgo {...args} />;

export const Base: StoryObj<typeof DateTimeAgo> = {
  args: {
    date: new Date()
  },
  render: template
};
