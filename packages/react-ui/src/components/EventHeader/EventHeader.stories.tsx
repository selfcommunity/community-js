import type { Meta, StoryObj } from '@storybook/react-webpack5';

import EventHeader, { EventHeaderProps } from './index';

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

const BaseTemplate = (args: EventHeaderProps) => (
  <div style={{width: '100%'}}>
    <EventHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof EventHeader> = {
  args: {
    eventId: 129
  },
  render: BaseTemplate
};

