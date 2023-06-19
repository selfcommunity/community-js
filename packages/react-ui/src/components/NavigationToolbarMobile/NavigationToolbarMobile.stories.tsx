import type { Meta, StoryObj } from '@storybook/react';
import NavigationToolbarMobile from './index';
import { AppBar, Icon, IconButton, Typography } from '@mui/material';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

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
} as Meta<typeof NavigationToolbarMobile>;


const template = (args) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbarMobile {...args}></NavigationToolbarMobile>
  </AppBar>
);

export const Base: StoryObj<NavigationToolbarMobile> = {
  args: {
    /* the args you need here will depend on your component */
    SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
    value: '/'
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    }
  },
  render: template
};


export const Custom: StoryObj<NavigationToolbarMobile> = {
  args: {
    SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
    value: '/',
    children: <><IconButton><Icon>arrow_back</Icon></IconButton><Typography variant="h4" sx={{flexGrow: 1}}>TITLE</Typography></>
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    }
  },
  render: template
};