import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserToastNotifications from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/UserToastNotifications',
  component: UserToastNotifications,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof UserToastNotifications>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserToastNotifications> = (args) => <UserToastNotifications {...args} />;

export const Base = Template.bind({});

Base.args = {
  /* the args you need here will depend on your component */
};
