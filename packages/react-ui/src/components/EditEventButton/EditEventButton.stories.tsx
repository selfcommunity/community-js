import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EditEventButton, { EditEventButtonProps } from './index';

export default {
  title: 'Design System/React UI/Edit Event Button',
  component: EditEventButton,
} as Meta<typeof EditEventButton>;

const template = (args: EditEventButtonProps) => (
  <div style={{width: 800}}>
    <EditEventButton {...args} />
  </div>
);

export const Base: StoryObj<EditEventButtonProps> = {
  args: {
    eventId: 113
  },
  render: template
};