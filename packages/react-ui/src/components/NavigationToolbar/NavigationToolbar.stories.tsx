import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import NavigationToolbar from './index';
import { AppBar, Typography } from '@mui/material';

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
} as Meta<typeof NavigationToolbar>;

const template = (args) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbar {...args} />
  </AppBar>
);

export const Base: StoryObj<NavigationToolbar> = {
  args: {
    /* the args you need here will depend on your component */
    SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
    value: '/',
    NotificationMenuProps: {
      SnippetNotificationsProps: {
        onFetchNotifications: (data) => {
          console.log(data);
        }
      }
    }
  },
  render: template
};

export const Custom: StoryObj<NavigationToolbar> = {
  args: {
    /* the args you need here will depend on your component */
    SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
    value: '/',
    children: <Typography variant="h4" sx={{flexGrow: 1}}>TITLE</Typography>
  },
  render: template
};