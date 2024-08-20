import type { Meta, StoryObj } from '@storybook/react';
import EventInfoWidget from './index';

export default {
  title: 'Design System/React UI/Event Info Widget',
  component: EventInfoWidget,
  args: {
    eventId: 113,
    summaryExpanded: false
  },
  render: (args) => (
    <EventInfoWidget {...args} />
  )
} as Meta<typeof EventInfoWidget>;

export const Base: StoryObj<EventInfoWidget> = {};
