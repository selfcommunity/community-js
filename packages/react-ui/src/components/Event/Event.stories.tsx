import type { Meta, StoryObj } from '@storybook/react';
import Event from './index';

export default {
  title: 'Design System/React UI/Event',
  component: Event,
  argTypes: {
    eventId: {
      control: {type: 'number'},
      description: 'Event Id',
      table: {defaultValue: {summary: 1}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
} as Meta<typeof Event>;

const template = (args) => (
  <div style={{width: 400}}>
    <Event {...args} />
  </div>
);

export const Base: StoryObj<Event> = {
  args: {
    eventId: 101,
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};

