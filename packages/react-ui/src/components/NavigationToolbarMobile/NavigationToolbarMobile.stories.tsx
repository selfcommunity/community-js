import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NavigationToolbarMobile, { NavigationToolbarMobileProps } from './index';
import { AppBar, Icon, IconButton, Typography } from '@mui/material';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

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
} as Meta<NavigationToolbarMobileProps>;


const template = (args: NavigationToolbarMobileProps) => (
  <AppBar position="relative" elevation={0}>
    <NavigationToolbarMobile {...args}></NavigationToolbarMobile>
  </AppBar>
);

export const Base: StoryObj<NavigationToolbarMobileProps> = {
  args: {
    /* the args you need here will depend on your component */
		SearchAutocompleteComponentProps: {onSearch: (q: any) => console.log(q), autoFocus: true, onSuggestionSelect: (type: any) => console.log(type)},
    value: '/'
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    }
  },
  render: template
};


export const Custom: StoryObj<NavigationToolbarMobileProps> = {
  args: {
		SearchAutocompleteComponentProps: {onSearch: (q: any) => console.log(q), autoFocus: true, onSuggestionSelect: (type: any) => console.log(type)},
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

export const Actions: StoryObj<NavigationToolbarMobileProps> = {
  args: {
		SearchAutocompleteComponentProps: {onSearch: (q: any) => console.log(q), autoFocus: true},
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
        <Icon>download</Icon>
      </IconButton>
    </>
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    }
  },
  render: template
};
