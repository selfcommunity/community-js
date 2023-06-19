import type { Meta, StoryObj } from '@storybook/react';
import CategoryAutocomplete from './index';

export default {
  title: 'Design System/React UI/Category Autocomplete',
  component: CategoryAutocomplete
} as Meta<typeof CategoryAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <CategoryAutocomplete {...args}></CategoryAutocomplete>
  </div>
);

export const Base: StoryObj<CategoryAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: false,
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
