import type { Meta, StoryObj } from '@storybook/react';
import GroupAutocomplete from './index';

export default {
  title: 'Design System/React UI/Group Autocomplete',
  component: GroupAutocomplete
} as Meta<typeof GroupAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <GroupAutocomplete {...args}></GroupAutocomplete>
  </div>
);

export const Base: StoryObj<GroupAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: false,
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
