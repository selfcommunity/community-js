import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import BottomNavigation from './index';
import { Mobile } from '../AppBar/AppBar.stories';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Bottom Navigation ',
  component: BottomNavigation,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof BottomNavigation>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BottomNavigation> = (args) => (
    <BottomNavigation {...args} />
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  value: '/'
};

Base.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
}
