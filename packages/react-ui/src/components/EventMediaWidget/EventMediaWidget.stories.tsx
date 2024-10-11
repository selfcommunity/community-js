import type { Meta, StoryObj } from '@storybook/react';
import EventMediaWidget from './index';

export default {
  title: 'Design System/React UI/Event Media Widget',
  component: EventMediaWidget,
  args: {
    eventId: 121
  }
} as Meta<typeof EventMediaWidget>;

export const Base: StoryObj<typeof EventMediaWidget> = {};
