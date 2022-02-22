import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserPopupNotifications from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/UserPopupNotifications',
  component: UserPopupNotifications,
} as ComponentMeta<typeof UserPopupNotifications>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserPopupNotifications> = (args) => (
  <div style={{width: '280px', height: '700px'}}>
    <UserPopupNotifications {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
