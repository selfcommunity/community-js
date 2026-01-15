import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventActionsMenu, { EventActionsMenuProps } from './index';

export default {
  title: 'Design System/React UI Shared/EventActionsMenu',
  component: EventActionsMenu,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'event Id',
      table: {defaultValue: {summary: '113'}}
    }
  },
  args: {
    eventId: 113,
  }
} as Meta<typeof EventActionsMenu>;

const template = (args: EventActionsMenuProps) => <EventActionsMenu {...args} />;

export const Base: StoryObj<typeof EventActionsMenu> = {
  render: template
};
