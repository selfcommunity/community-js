import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UserProfileTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/User Profile',
  component: UserProfileTemplate
} as ComponentMeta<typeof UserProfileTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserProfileTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <UserProfileTemplate {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {
  userId: 1
};
