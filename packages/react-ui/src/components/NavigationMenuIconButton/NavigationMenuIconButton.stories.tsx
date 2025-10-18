import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NavigationMenuIconButton from './index';
import {Typography} from '@mui/material';

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
export const Base: StoryObj<typeof NavigationMenuIconButton> = {
  render: template
};

// @ts-ignore
export const Custom: StoryObj<typeof NavigationMenuIconButton> = {
	args: {
		/* the args you need here will depend on your component */
		DrawerProps: {drawerContent: <Typography variant="h4" sx={{flexGrow: 1}}>TITLE</Typography>, anchor: 'right'}
	},
	render: template
};
