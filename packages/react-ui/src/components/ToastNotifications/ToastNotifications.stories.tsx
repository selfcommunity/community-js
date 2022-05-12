import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ToastNotifications from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/ToastNotifications',
  component: ToastNotifications,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof ToastNotifications>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToastNotifications> = (args) => <ToastNotifications {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
