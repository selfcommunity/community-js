import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import NavigationToolbarMobile from './index';
import { AppBar } from '@mui/material';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Navigation Toolbar Mobile',
  component: NavigationToolbarMobile,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof NavigationToolbarMobile>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavigationToolbarMobile> = (args) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbarMobile {...args}></NavigationToolbarMobile>
  </AppBar>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
  value: '/'
};

Base.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
}
