import type { Meta, StoryObj } from '@storybook/react';
import EventMembersWidget from './index';

export default {
  title: 'Design System/React UI/Event Members Widget',
  args: {
    eventId: 121,
    limit: 5
  },
  component: EventMembersWidget
} as Meta<typeof EventMembersWidget>;


export const Base: StoryObj<EventMembersWidget> = {};
