import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import BaseItemButton from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SHARED COMPONENT/BaseItemButton',
  component: BaseItemButton
} as ComponentMeta<typeof BaseItemButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseItemButton> = (args) => <BaseItemButton {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  primary: 'TITOLO',
  secondary: 'caption'
};
