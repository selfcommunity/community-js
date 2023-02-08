import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import AppBar, { NavigationToolbar, NavigationToolbarMobile } from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/AppBar ',
  component: AppBar,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof AppBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const BaseTemplate: ComponentStory<typeof AppBar> = (args) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbar {...args} />
  </AppBar>
);

export const Desktop = BaseTemplate.bind({});

const MobileTemplate: ComponentStory<typeof AppBar> = (args) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbarMobile {...args}></NavigationToolbarMobile>
  </AppBar>
);
export const Mobile = MobileTemplate.bind({});

Desktop.args = Mobile.args = {
  /* the args you need here will depend on your component */
  SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
  value: '/'
};

Mobile.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
}
