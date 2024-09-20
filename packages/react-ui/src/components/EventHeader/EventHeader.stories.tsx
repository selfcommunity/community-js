import type { Meta, StoryObj } from '@storybook/react';

import EventHeader from './index';

export default {
  title: 'Design System/React UI/Event Header',
  component: EventHeader,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'Event Id'
    }
  },
} as Meta<typeof EventHeader>;

const BaseTemplate = (args) => (
  <div style={{width: '100%'}}>
    <EventHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof EventHeader> = {
  args: {
    eventId: 123
  },
  render: BaseTemplate
};

