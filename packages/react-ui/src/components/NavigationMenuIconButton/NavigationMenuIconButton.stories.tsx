import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import NavigationMenuIconButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Navigation Menu Icon Button',
  component: NavigationMenuIconButton,
  argTypes: {
    },
  args: {
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof NavigationMenuIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavigationMenuIconButton> = (args) => (
  <div style={{width: '100%'}}>
    <NavigationMenuIconButton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
