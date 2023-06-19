import type { Meta, StoryObj } from '@storybook/react';
import LocationAutocomplete from './index';

export default {
  title: 'Design System/React UI/Location Autocomplete',
  component: LocationAutocomplete
} as Meta<typeof LocationAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <LocationAutocomplete {...args}></LocationAutocomplete>
  </div>
);

export const Base: StoryObj<LocationAutocomplete> = {
  args: {
    onChange: (value) => console.log(value)
  },
  render: template
};
