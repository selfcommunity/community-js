import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LocationAutocomplete, { LocationAutocompleteProps } from './index';

export default {
  title: 'Design System/React UI/Location Autocomplete',
  component: LocationAutocomplete
} as Meta<typeof LocationAutocomplete>;

const template = (args: LocationAutocompleteProps) => (
  <div style={{width: 400}}>
    <LocationAutocomplete {...args}></LocationAutocomplete>
  </div>
);

export const Base: StoryObj<typeof LocationAutocomplete> = {
  args: {
    onChange: (value) => console.log(value)
  },
  render: template
};
