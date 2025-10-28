import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GroupAutocomplete, { GroupAutocompleteProps } from './index';

export default {
  title: 'Design System/React UI/Group Autocomplete',
  component: GroupAutocomplete
} as Meta<typeof GroupAutocomplete>;

const template = (args: GroupAutocompleteProps) => (
  <div style={{width: 400}}>
    <GroupAutocomplete {...args}></GroupAutocomplete>
  </div>
);

export const Base: StoryObj<typeof GroupAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: false,
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
