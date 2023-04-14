import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import PeopleSuggestionWidget from './index';
import {createTheme, ThemeProvider} from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/People Suggestion Widget',
  component: PeopleSuggestionWidget,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof PeopleSuggestionWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PeopleSuggestionWidget> = (args) => (
  <div style={{width: 400}}>
    <PeopleSuggestionWidget {...args} />
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
