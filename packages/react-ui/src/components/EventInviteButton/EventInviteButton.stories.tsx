import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventInviteButton, { EventInviteButtonProps } from './index';

export default {
  title: 'Design System/React UI/Event Invite Button',
  component: EventInviteButton,
  args: {
    eventId: 113
  }
} as Meta<typeof EventInviteButton>;

const template = (args: EventInviteButtonProps) => (
  <div style={{width: 800}}>
    <EventInviteButton {...args} />
  </div>
);

export const Base: StoryObj<EventInviteButtonProps> = {
  args: {
    eventId: 113
  },
  render: template
};