import type { Meta, StoryObj } from '@storybook/react-webpack5';
import SearchAutocomplete, { SearchAutocompleteProps } from './index';

export default {
  title: 'Design System/React UI/Search Autocomplete',
  component: SearchAutocomplete
} as Meta<typeof SearchAutocomplete>;

const template = (args: SearchAutocompleteProps) => (
  <div style={{width: 400}}>
    <SearchAutocomplete {...args} />
  </div>
);

export const Base: StoryObj<typeof SearchAutocomplete> = {
  render: template
};