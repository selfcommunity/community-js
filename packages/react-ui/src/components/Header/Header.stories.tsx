import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import Header from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Header ',
  component: Header,
  parameters: {
    // The viewports object from the Essentials addon
    viewport: {
      // The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
    },
  },
} as ComponentMeta<typeof Header>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Header> = (args) => (
    <Header {...args} />
);

export const Base = Template.bind({});
export const MobileHeader = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};

MobileHeader.parameters = {
  viewport: {
    defaultViewport: 'iphone6',
  }
};
