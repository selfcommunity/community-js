import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CreateEventButton, { CreateEventButtonProps } from './index';

export default {
  title: 'Design System/React UI/Create Event Button',
  component: CreateEventButton,
} as Meta<typeof CreateEventButton>;

const template = (args: CreateEventButtonProps) => (
  <div style={{width: 800}}>
    <CreateEventButton {...args} />
  </div>
);

export const Base: StoryObj<CreateEventButtonProps> = {
  args: {},
  render: template
};