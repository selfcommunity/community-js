import type { Meta, StoryObj } from '@storybook/react';
import NavigationMenuIconButton from './index';
import { Typography } from '@mui/material';
import React from 'react';

export default {
  title: 'Design System/React UI/Navigation Menu Icon Button',
  component: NavigationMenuIconButton,
} as Meta<typeof NavigationMenuIconButton>;


const template = (args) => (
  <div style={{width: '100%'}}>
    <NavigationMenuIconButton {...args} />
  </div>
);

// @ts-ignore
export const Base: StoryObj<NavigationMenuIconButton> = {
  render: template
};

// @ts-ignore
export const Custom: StoryObj<NavigationMenuIconButton> = {
	args: {
		/* the args you need here will depend on your component */
		SearchAutocompleteProps: {onSearch: (q) => console.log(q)},
		value: '/',
		DrawerProps: {drawerContent: <Typography variant="h4" sx={{flexGrow: 1}}>TITLE</Typography>, anchor: 'right'}
	},
	render: template
};
