import type { Meta, StoryObj } from '@storybook/react-webpack5';
import TagAutocomplete, { TagAutocompleteProps } from './index';

export default {
  title: 'Design System/React UI/Tag Autocomplete',
  component: TagAutocomplete
} as Meta<typeof TagAutocomplete>;

const template = (args: TagAutocompleteProps) => (
  <div style={{width: 400}}>
    <TagAutocomplete {...args} />
  </div>
);

export const Base: StoryObj<typeof TagAutocomplete> = {
  args: {
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
