import type { Meta, StoryObj } from '@storybook/react-webpack5';
import  UserAutocomplete, { UserAutocompleteProps } from './index';

export default {
  title: 'Design System/React UI/User Autocomplete',
  component:  UserAutocomplete
} as Meta<typeof  UserAutocomplete>;

const template = (args: UserAutocompleteProps) => (
  <div style={{width: 400}}>
    <UserAutocomplete {...args} />
  </div>
);

export const Base: StoryObj< typeof UserAutocomplete> = {
  args: {
    /* the args you need here will depend on your component */
    multiple: true,
    defaultValue: undefined,
    onChange: (value) => console.log(value)
  },
  render: template
};
