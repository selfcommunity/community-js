import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import NavigationToolbar from './index';
import {AppBar, Badge, Box, Grid, IconButton, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useCallback, useState} from 'react';
import {NavigationMenuDrawer} from '../NavigationMenuIconButton';
import Paper from '@mui/material/Paper';

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

const templateContent = (args) => {

	const [open, setOpen] = useState<boolean>(true);
	const handleIconClick = useCallback(() => {
		setOpen(!open);
	}, [open]);

	return <Box sx={{position: 'relative', display: 'flex', marginTop: '70px'}}>
		<AppBar sx={{marginTop: '70px'}}>
			<NavigationToolbar {...args} NavigationMenuIconButtonComponentProps={{showDrawer: false, onMenuIconClick: handleIconClick}} />
		</AppBar>
		<NavigationMenuDrawer
			variant={'persistent'}
			open={open}
			showDrawerHeader={false}
			drawerHeaderContent={null}
			sx={{
			...(open && {width: '270px'}),
				flexShrink: 0,
				zIndex: 1000,
				[`& .MuiDrawer-paper`]: {
					marginTop: '70px',
					width: '280px',
					paddingTop: '50px',
					paddingLeft: '8px',
					boxSizing: 'border-box',
					overflowY: 'hidden'
				}
			}}
		/>
		<Box sx={{flexGrow: 1, marginTop: '70px'}}>
			<Grid container sx={{width: '100%'}}>
				<Grid item xs={2}></Grid>
				<Grid item xs={8}>
					<Paper sx={{height: 200, width: '100%'}}>
						Content
					</Paper>
				</Grid>
				<Grid item xs={2}></Grid>
			</Grid>
		</Box>
	</Box>
};

// @ts-ignore
export const Base: StoryObj<NavigationToolbar> = {
  args: {
    /* the args you need here will depend on your component */
		SearchAutocompleteComponentProps: {onSearch: (q) => console.log(q)},
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

// @ts-ignore
export const Custom: StoryObj<NavigationToolbar> = {
  args: {
    /* the args you need here will depend on your component */
		SearchAutocompleteComponentProps: {onSearch: (q) => console.log(q)},
    value: '/',
    children: <Typography variant="h4" sx={{flexGrow: 1}}>TITLE</Typography>
  },
  render: template
};

// @ts-ignore
export const Actions: StoryObj<NavigationToolbar> = {
  args: {
    /* the args you need here will depend on your component */
		SearchAutocompleteComponentProps: {onSearch: (q) => console.log(q)},
    value: '/',
    startActions: <>
      <IconButton>
        <Icon>card_membership</Icon>
      </IconButton>
    </>,
    endActions: <>
			<IconButton>
				<Icon>my_community</Icon>
			</IconButton>
			<IconButton>
				<Icon>magic_wand</Icon>
			</IconButton>
			<IconButton>
				<Icon>private</Icon>
			</IconButton>
			<IconButton>
        <Icon>download</Icon>
      </IconButton>
    </>
  },
  render: template
};

// @ts-ignore
export const CustomContent: StoryObj<NavigationToolbar> = {
	args: {
		/* the args you need here will depend on your component */
		NavigationMenuIconButtonComponentProps: {
			showDrawer: false
		}
	},
	render: templateContent
};
