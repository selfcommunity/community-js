import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventForm, { EventFormProps } from './index';

export default {
  title: 'Design System/React UI/Event Form',
  component: EventForm,
} as Meta<typeof EventForm>;

const template = (args: EventFormProps) => (
  <div style={{width: 800}}>
    <EventForm {...args} />
  </div>
);


export const Base: StoryObj<EventFormProps> = {
  args: {},
  render: template
};
