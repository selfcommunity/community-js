import type { Meta, StoryObj } from '@storybook/react';
import EventPartecipantsButton from './index';

export default {
  title: 'Design System/React UI/Event Partecipants Button ',
  component: EventPartecipantsButton,
  render: (args) => (
    <EventPartecipantsButton {...args} />
  )
} as Meta<typeof EventPartecipantsButton>;

export const Base: StoryObj<EventPartecipantsButton> = {}