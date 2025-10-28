import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EventAutocomplete, { EventAutocompleteProps } from './index';

export default {
  title: 'Design System/React UI/Event Autocomplete',
  component: EventAutocomplete
} as Meta<typeof EventAutocomplete>;

const template = (args: EventAutocompleteProps) => (
  <div style={{width: 400}}>
    <EventAutocomplete {...args}></EventAutocomplete>
  </div>
);

export const Base: StoryObj<typeof EventAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: false,
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
