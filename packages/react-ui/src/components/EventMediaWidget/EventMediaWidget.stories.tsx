import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventMediaWidget from './index';

export default {
  title: 'Design System/React UI/Event Media Widget',
  component: EventMediaWidget,
  args: {
    eventId: 129
  }
} as Meta<typeof EventMediaWidget>;

export const Base: StoryObj<typeof EventMediaWidget> = {};
