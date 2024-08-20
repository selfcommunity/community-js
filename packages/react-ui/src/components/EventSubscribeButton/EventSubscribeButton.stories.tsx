import type { Meta, StoryObj } from '@storybook/react';
import EventSubscribeButton, { EventSubscribeButtonProps } from './index';

export default {
  title: 'Design System/React UI/Event Subscribe Button',
  component: EventSubscribeButton,
  args: {
    eventId: 113
  }
} as Meta<typeof EventSubscribeButton>;

const template = (args) => (
    <EventSubscribeButton {...args} />
);

export const Base: StoryObj<EventSubscribeButtonProps> = {
  args: {
    eventId: 113
  },
  render: template
};