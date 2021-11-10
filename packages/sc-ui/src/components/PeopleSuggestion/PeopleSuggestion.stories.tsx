import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PeopleSuggestion from './index';
import {createTheme, ThemeProvider} from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/People Suggestion',
  component: PeopleSuggestion
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PeopleSuggestion>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PeopleSuggestion> = (args) => (
  <div style={{width: 400}}>
    <PeopleSuggestion {...args} />
  </div>
);

/**
 *
 <ThemeProvider
 theme={createTheme({
        palette: {
          secondary: {
            main: '#dc1616'
          }
        }
      })}>
  <PeopleSuggestion {...args} />
 </ThemeProvider>
 */

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
