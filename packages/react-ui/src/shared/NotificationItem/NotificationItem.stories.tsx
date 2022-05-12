import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import NotificationItem from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI Shared/NotificationItem',
  component: NotificationItem
} as ComponentMeta<typeof NotificationItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NotificationItem> = (args) => <NotificationItem {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
  primary: 'TITOLO',
  secondary: 'caption'
};
