import type { Meta, StoryObj } from '@storybook/react-webpack5';
import  UserAutocomplete from './index';

export default {
  title: 'Design System/React UI/User Autocomplete',
  component:  UserAutocomplete
} as Meta<typeof  UserAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserAutocomplete {...args}></ UserAutocomplete>
  </div>
);

export const Base: StoryObj< typeof UserAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: true,
    defaultValue: null,
    onChange: (value) => console.log(value)
  },
  render: template
};
