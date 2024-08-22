import type { Meta, StoryObj } from '@storybook/react';
import EventActionsMenu from './index';

export default {
  title: 'Design System/React UI Shared/EventActionsMenu',
  component: EventActionsMenu,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'event Id',
      table: {defaultValue: {summary: 113}}
    }
  },
  args: {
    eventId: 113,
  }
} as Meta<typeof EventActionsMenu>;

const template = (args) => <EventActionsMenu {...args} />;

export const Base: StoryObj<EventActionsMenu> = {
  render: template
};
