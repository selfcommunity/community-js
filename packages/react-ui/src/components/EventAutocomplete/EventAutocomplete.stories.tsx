import type { Meta, StoryObj } from '@storybook/react';
import EventAutocomplete from './index';

export default {
  title: 'Design System/React UI/Event Autocomplete',
  component: EventAutocomplete
} as Meta<typeof EventAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <EventAutocomplete {...args}></EventAutocomplete>
  </div>
);

export const Base: StoryObj<EventAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: false,
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
