import type { Meta, StoryObj } from '@storybook/react';
import EventParticipantsButton from './index';

export default {
  title: 'Design System/React UI/Event Participants Button ',
  component: EventParticipantsButton,
  args: {
    eventId: 121
  }
} as Meta<typeof EventParticipantsButton>;

export const Base: StoryObj<typeof EventParticipantsButton> = {}
