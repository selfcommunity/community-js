import type { Meta, StoryObj } from '@storybook/react';
import MyEventsWidget from './index';

export default {
  title: 'Design System/React UI/My Events Widget',
  component: MyEventsWidget,
  render: (args) => (
    <MyEventsWidget {...args} />
  )
} as Meta<typeof MyEventsWidget>;


export const Base: StoryObj<MyEventsWidget> = {};
