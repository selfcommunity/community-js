import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import NavigationToolbar from './index';
import { AppBar } from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Navigation Toolbar ',
  component: NavigationToolbar,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof NavigationToolbar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const BaseTemplate: ComponentStory<typeof NavigationToolbar> = (args) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbar {...args} />
  </AppBar>
);

export const Main = BaseTemplate.bind({});

Main.args = {
  /* the args you need here will depend on your component */
  SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
  value: '/'
};
