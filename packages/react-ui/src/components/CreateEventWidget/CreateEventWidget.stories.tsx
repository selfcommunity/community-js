import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CreateEventWidget from './index';

export default {
  title: 'Design System/React UI/Create Event Widget',
  component: CreateEventWidget,
  render: (args) => (
    <CreateEventWidget {...args} />
  )
} as Meta<typeof CreateEventWidget>;


export const Base: StoryObj<typeof CreateEventWidget> = {};
