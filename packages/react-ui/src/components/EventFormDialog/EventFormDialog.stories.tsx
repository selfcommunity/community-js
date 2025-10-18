import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventFormDialog from './index';

export default {
  title: 'Design System/React UI/Event Form Dialog',
  component: EventFormDialog,
} as Meta<typeof EventFormDialog>;

const template = (args) => (
  <div style={{width: 800}}>
    <EventFormDialog {...args} />
  </div>
);


export const Base: StoryObj<typeof EventFormDialog> = {
  args: {},
  render: template
};
