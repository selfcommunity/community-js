import type { Meta, StoryObj } from '@storybook/react';
import TagAutocomplete from './index';

export default {
  title: 'Design System/React UI/Tag Autocomplete',
  component: TagAutocomplete
} as Meta<typeof TagAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <TagAutocomplete {...args}></TagAutocomplete>
  </div>
);

export const Base: StoryObj<TagAutocomplete> = {
  args: {
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
