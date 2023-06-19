import type { Meta, StoryObj } from '@storybook/react';
import SearchAutocomplete from './index';

export default {
  title: 'Design System/React UI/Search Autocomplete',
  component: SearchAutocomplete
} as Meta<typeof SearchAutocomplete>;

const template = (args) => (
  <div style={{width: 400}}>
    <SearchAutocomplete {...args}></SearchAutocomplete>
  </div>
);

export const Base: StoryObj<SearchAutocomplete> = {
  render: template
};